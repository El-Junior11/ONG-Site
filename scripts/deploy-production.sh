#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

VPS_DIR="${1:?Répertoire requis}"
VERSION="${2:?Version requise}"
cd "$VPS_DIR"

COMPOSE=(docker compose -p ong-site -f docker-compose.prod.yml)
IMAGE_BACK="ghcr.io/el-junior11/ong-site-backend"
IMAGE_FRONT="ghcr.io/el-junior11/ong-site-frontend"

echo "========== DEPLOIEMENT PRODUCTION =========="

# Identification de la version réellement active
BACK_CONTAINER=$("${COMPOSE[@]}" ps -q backend)
FRONT_CONTAINER=$("${COMPOSE[@]}" ps -q frontend)
POSTGRES_CONTAINER=$("${COMPOSE[@]}" ps -q postgres)

test -n "$BACK_CONTAINER"
test -n "$FRONT_CONTAINER"
test -n "$POSTGRES_CONTAINER"

OLD_BACK=$(docker inspect -f '{{.Config.Image}}' "$BACK_CONTAINER")
OLD_FRONT=$(docker inspect -f '{{.Config.Image}}' "$FRONT_CONTAINER")
OLD_VERSION="${OLD_BACK##*:}"

if [ "${OLD_FRONT##*:}" != "$OLD_VERSION" ]; then
  echo "ERREUR : versions backend et frontend incohérentes"
  exit 1
fi

echo "Version active : $OLD_VERSION"
echo "Nouvelle version : $VERSION"

# Sauvegarde de la configuration
cp -p .env ".env.backup.$(date +%Y%m%d-%H%M%S)"

rollback() {
  local code=$?
  trap - ERR
  echo "ERREUR : déploiement échoué, rollback vers $OLD_VERSION"
  sed -i "s/^VERSION=.*/VERSION=$OLD_VERSION/" .env
  if "${COMPOSE[@]}" up -d --no-deps backend frontend </dev/null; then
    echo "Anciens conteneurs réactivés"
  else
    echo "ERREUR : rollback incomplet, intervention nécessaire"
  fi
  exit "$code"
}

trap rollback ERR

# Vérification PostgreSQL
DB_HEALTH=$(docker inspect -f '{{.State.Health.Status}}' "$POSTGRES_CONTAINER")
test "$DB_HEALTH" = "healthy"

# Sauvegarde PostgreSQL
echo "========== SAUVEGARDE POSTGRESQL =========="
BACKUP_DIR="$HOME/backups/ong-site"
mkdir -p "$BACKUP_DIR"
DB_BACKUP="$BACKUP_DIR/site_db_$(date +%Y%m%d_%H%M%S)_$OLD_VERSION.dump"

docker exec "$POSTGRES_CONTAINER" pg_dump \
  -U postgres -d site_db -Fc </dev/null > "$DB_BACKUP"

test -s "$DB_BACKUP"

docker exec -i "$POSTGRES_CONTAINER" pg_restore --list \
  < "$DB_BACKUP" >/dev/null

echo "Sauvegarde vérifiée : $DB_BACKUP"

# Téléchargement des images
echo "========== TELECHARGEMENT DES IMAGES =========="
docker pull "$IMAGE_BACK:$VERSION" </dev/null
docker pull "$IMAGE_FRONT:$VERSION" </dev/null

# Extraction et application de la migration
echo "========== MIGRATION POSTGRESQL =========="
MIGRATION=$(mktemp)
trap 'rm -f "$MIGRATION"' EXIT

docker run --rm --entrypoint cat "$IMAGE_BACK:$VERSION" \
  /app/migrations/001_intervention_translations.sql \
  </dev/null > "$MIGRATION"

test -s "$MIGRATION"

docker exec -i "$POSTGRES_CONTAINER" psql \
  -U postgres -d site_db -v ON_ERROR_STOP=1 < "$MIGRATION"

MIGRATION_OK=$(docker exec "$POSTGRES_CONTAINER" psql \
  -U postgres -d site_db -Atc \
  "SELECT to_regclass('public.intervention_translations') IS NOT NULL;")

test "$MIGRATION_OK" = "t"
echo "Migration PostgreSQL terminée"

# Activation de la nouvelle version
echo "========== ACTIVATION DES CONTENEURS =========="
sed -i "s/^VERSION=.*/VERSION=$VERSION/" .env
"${COMPOSE[@]}" config --quiet
"${COMPOSE[@]}" up -d --no-deps backend frontend </dev/null

# Vérification du frontend et de l'API
echo "========== VERIFICATION DES SERVICES =========="
READY=0

for i in $(seq 1 30); do
  if curl -fsS --max-time 5 http://127.0.0.1:8087/ >/dev/null &&
     curl -fsS --max-time 10 http://127.0.0.1:8087/api/interventions |
     python3 -c 'import json,sys; assert isinstance(json.load(sys.stdin),list)'; then
    READY=1
    echo "Frontend et API opérationnels"
    break
  fi
  echo "Attente des services ($i/30)..."
  sleep 3
done

test "$READY" -eq 1

# Vérification des versions actives
echo "========== VERIFICATION DES VERSIONS =========="

for SERVICE in backend frontend; do
  CONTAINER=$("${COMPOSE[@]}" ps -q "$SERVICE")
  test -n "$CONTAINER"

  STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER")
  IMAGE=$(docker inspect -f '{{.Config.Image}}' "$CONTAINER")

  test "$STATUS" = "running"
  test "${IMAGE##*:}" = "$VERSION"

  echo "$SERVICE : version $VERSION confirmée"
done

# Vérification de la conservation du conteneur PostgreSQL
test "$("${COMPOSE[@]}" ps -q postgres)" = "$POSTGRES_CONTAINER"
test "$(docker inspect -f '{{.State.Health.Status}}' "$POSTGRES_CONTAINER")" = "healthy"

"${COMPOSE[@]}" ps

trap - ERR

echo "SUCCESS : déploiement ONG-Site version $VERSION terminé"
