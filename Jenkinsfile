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

            REMOTE_SCRIPT="/tmp/ong-site-deploy-${BUILD_NUMBER}-${VERSION}.sh"

            trap 'ssh -n -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" "rm -f $REMOTE_SCRIPT" || true' EXIT

            ssh -n -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" "test -f '$VPS_DIR/docker-compose.prod.yml' && test -f '$VPS_DIR/.env' && test -f '$VPS_DIR/backend/.env'"

            scp -o StrictHostKeyChecking=yes scripts/deploy-production.sh "$VPS_USER@$VPS_HOST:$REMOTE_SCRIPT"

            ssh -n -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" "bash '$REMOTE_SCRIPT' '$VPS_DIR' '$VERSION'"

            echo "Verification independante du deploiement..."

            ssh -n -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" "docker inspect -f '{{.Config.Image}}' ong-site-backend-1" | grep -Fx "$BACK_IMAGE"

            ssh -n -o StrictHostKeyChecking=yes "$VPS_USER@$VPS_HOST" "docker inspect -f '{{.Config.Image}}' ong-site-frontend-1" | grep -Fx "$FRONT_IMAGE"

            echo "Deploiement production confirme"
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