pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    skipDefaultCheckout(true)
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 45, unit: 'MINUTES')
  }

  parameters {
    booleanParam(name: 'DEPLOY_PROD', defaultValue: false, description: 'Autoriser le déploiement en production')
  }

  environment {
    REGISTRY = 'ghcr.io'
    IMAGE_FRONT = 'ghcr.io/el-junior11/ong-site-frontend'
    IMAGE_BACK = 'ghcr.io/el-junior11/ong-site-backend'
    VPS_HOST = '15.235.242.72'
    VPS_USER = 'ubuntu'
    VPS_DIR = '/opt/tsinjo-aina-site'
    DOCKER_BUILDKIT = '1'
  }

  stages {
    stage('01 - Récupération du code source') {
      steps {
        checkout scm
        script {
          env.VERSION = sh(script: 'git rev-parse --short=12 HEAD', returnStdout: true).trim()
          env.FRONT_IMAGE = "${IMAGE_FRONT}:${VERSION}"
          env.BACK_IMAGE = "${IMAGE_BACK}:${VERSION}"
          echo "Version à construire : ${env.VERSION}"
        }
      }
    }

    stage('02 - Analyse des secrets') {
      steps {
        sh '''
          set -eu
          for file in .env backend/.env frontend/.env backups/site_db.dump; do
            if git ls-files --error-unmatch "$file" >/dev/null 2>&1; then
              echo "ERREUR : fichier sensible suivi par Git : $file"
              exit 1
            fi
          done

          VOLUME="ong-site-secrets-${BUILD_NUMBER}"
          docker volume create "$VOLUME" >/dev/null
          trap 'docker volume rm "$VOLUME" >/dev/null 2>&1 || true' EXIT

          tar --exclude=.git --exclude=node_modules --exclude=.env \
            --exclude=backend/.env --exclude=frontend/.env \
            --exclude=backups/site_db.dump -cf - . | \
            docker run --rm -i -v "$VOLUME:/src" alpine:3.21 \
            sh -c "tar -xf - -C /src"

          docker run --rm -v "$VOLUME:/src:ro" \
            ghcr.io/gitleaks/gitleaks:latest dir /src --redact
        '''
      }
    }

    stage('03 - Tests du backend') {
      steps {
        sh '''
          set -eu
          VOLUME="ong-site-back-${BUILD_NUMBER}"
          docker volume create "$VOLUME" >/dev/null
          trap 'docker volume rm "$VOLUME" >/dev/null 2>&1 || true' EXIT

          tar -C backend --exclude=node_modules -cf - . | \
            docker run --rm -i -v "$VOLUME:/app" -w /app node:22-alpine \
            sh -c "tar -xf - && npm ci && npm test && npm audit --omit=dev --audit-level=high"
        '''
      }
    }

    stage('04 - Analyse de la qualité du frontend') {
      steps {
        sh '''
          set -eu
          VOLUME="ong-site-front-${BUILD_NUMBER}"
          docker volume create "$VOLUME" >/dev/null
          trap 'docker volume rm "$VOLUME" >/dev/null 2>&1 || true' EXIT

          tar -C frontend --exclude=node_modules -cf - . | \
            docker run --rm -i -v "$VOLUME:/app" -w /app node:22-alpine \
            sh -c "tar -xf - && npm ci && npm run lint && npm audit --omit=dev --audit-level=high && npm run build"
        '''
      }
    }

    stage('05 - Construction des images Docker') {
      steps {
        sh '''
          set -eu
          docker build -t "$BACK_IMAGE" ./backend
          docker build -t "$FRONT_IMAGE" ./frontend
        '''
      }
    }

    stage('06 - Analyse de sécurité des images') {
      steps {
        sh '''
          set -eu
          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --image-src docker \
            --exit-code 1 --severity HIGH,CRITICAL "$BACK_IMAGE"

          docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy:latest image --image-src docker \
            --exit-code 1 --severity HIGH,CRITICAL "$FRONT_IMAGE"
        '''
      }
    }

    stage('07 - Publication des images sur GHCR') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'ong-site-ghcr', usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
          sh '''
            set -eu
            set +x
            trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT

            echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USER" --password-stdin
            docker push "$BACK_IMAGE"
            docker push "$FRONT_IMAGE"
          '''
        }
      }
    }

    stage('08 - Validation du déploiement') {
      when {
        expression { params.DEPLOY_PROD }
      }
      steps {
        input message: "Déployer ONG-Site version ${env.VERSION} sur le VPS ?", ok: 'Déployer'
      }
    }

    stage('09 - Déploiement en production') {
      when {
        expression { params.DEPLOY_PROD }
      }
      steps {
        sshagent(credentials: ['ong-site-vps-ssh']) {
          sh '''
            set -eu

            ssh -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" \
              "test -f '$VPS_DIR/docker-compose.prod.yml' && \
               test -f '$VPS_DIR/.env' && \
               test -f '$VPS_DIR/backend/.env'"

            ssh -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" \
              "bash -s" -- "$VPS_DIR" "$VERSION" <<'REMOTE'
set -Eeuo pipefail

VPS_DIR="$1"
VERSION="$2"
cd "$VPS_DIR"

COMPOSE=(docker compose -p ong-site -f docker-compose.prod.yml)

OLD_VERSION=$(sed -n 's/^VERSION=//p' .env | head -n 1)
if [ -z "$OLD_VERSION" ]; then
  echo "ERREUR : VERSION absente du fichier .env"
  exit 1
fi

echo "Ancienne version : $OLD_VERSION"
echo "Nouvelle version : $VERSION"

cp -p .env ".env.backup.$OLD_VERSION"

rollback() {
  echo "ERREUR : déploiement échoué, lancement du rollback"
  sed -i "s/^VERSION=.*/VERSION=$OLD_VERSION/" .env
  "${COMPOSE[@]}" up -d --no-deps backend frontend || true
}

trap rollback ERR

sed -i "s/^VERSION=.*/VERSION=$VERSION/" .env

"${COMPOSE[@]}" config --quiet

echo "Sauvegarde PostgreSQL avant migration..."
umask 077
BACKUP_DIR="$HOME/backups/ong-site"
mkdir -p "$BACKUP_DIR"
DB_BACKUP="$BACKUP_DIR/site_db_$(date +%Y%m%d_%H%M%S)_$OLD_VERSION.dump"

"${COMPOSE[@]}" exec -T postgres pg_dump -U postgres -d site_db -Fc > "$DB_BACKUP"
test -s "$DB_BACKUP"
"${COMPOSE[@]}" exec -T postgres pg_restore --list < "$DB_BACKUP" >/dev/null

echo "Sauvegarde vérifiée : $DB_BACKUP"

echo "Téléchargement des nouvelles images..."
"${COMPOSE[@]}" pull backend frontend

echo "Application de la migration PostgreSQL..."
docker run --rm --entrypoint cat   "ghcr.io/el-junior11/ong-site-backend:$VERSION"   /app/migrations/001_intervention_translations.sql |   "${COMPOSE[@]}" exec -T postgres   psql -U postgres -d site_db -v ON_ERROR_STOP=1

echo "Migration PostgreSQL terminée"

"${COMPOSE[@]}" up -d --no-deps backend frontend

echo "Attente du démarrage du frontend..."

READY=0
for i in $(seq 1 20); do
  if curl --fail --silent --max-time 5 \
    http://127.0.0.1:8087/ >/dev/null 2>&1; then
    READY=1
    echo "Frontend prêt après tentative $i"
    break
  fi
  echo "Frontend non prêt ($i/20), attente..."
  sleep 3
done

if [ "$READY" -ne 1 ]; then
  echo "ERREUR : frontend indisponible après 20 tentatives"
  false
fi

echo "Vérification de l'API backend..."

API_READY=0
for i in $(seq 1 20); do
  if curl --fail --silent --max-time 10     http://127.0.0.1:8087/api/interventions |     python3 -c 'import json,sys; assert isinstance(json.load(sys.stdin),list)'     >/dev/null 2>&1; then
    API_READY=1
    echo "API backend opérationnelle"
    break
  fi
  sleep 3
done

if [ "$API_READY" -ne 1 ]; then
  echo "ERREUR : API backend indisponible"
  false
fi

echo "Vérification des conteneurs..."

"${COMPOSE[@]}" ps

for SERVICE in backend frontend postgres; do
  CONTAINER=$("${COMPOSE[@]}" ps -q "$SERVICE")
  if [ -z "$CONTAINER" ]; then
    echo "ERREUR : conteneur $SERVICE introuvable"
    false
  fi

  STATUS=$(docker inspect -f '{{.State.Status}}' "$CONTAINER")
  if [ "$STATUS" != "running" ]; then
    echo "ERREUR : $SERVICE n'est pas en cours d'exécution"
    false
  fi
done

POSTGRES_CONTAINER=$("${COMPOSE[@]}" ps -q postgres)
DB_HEALTH=$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' "$POSTGRES_CONTAINER")

if [ "$DB_HEALTH" != "healthy" ]; then
  echo "ERREUR : PostgreSQL non healthy ($DB_HEALTH)"
  false
fi

echo "Vérification des versions Docker..."

for SERVICE in backend frontend; do
  CONTAINER=$("${COMPOSE[@]}" ps -q "$SERVICE")
  IMAGE=$(docker inspect -f '{{.Config.Image}}' "$CONTAINER")

  case "$IMAGE" in
    *":$VERSION") echo "$SERVICE : version $VERSION confirmée" ;;
    *)
      echo "ERREUR : version incorrecte pour $SERVICE : $IMAGE"
      false
      ;;
  esac
done

trap - ERR

echo "SUCCESS : déploiement ONG-Site version $VERSION terminé"
REMOTE
          '''
        }
      }
    }
  }

  post {
    success {
      echo "SUCCESS : Pipeline ${env.VERSION}"
    }
    failure {
      echo "FAILED : Pipeline ${env.VERSION}"
    }
    always {
      deleteDir()
    }
  }
}