
pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'site'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                sh '''
                    docker --version
                    docker compose version
                '''
            }
        }

        stage('Stop Previous Containers') {
            steps {
                sh '''
                    docker compose down --remove-orphans || true
                '''
            }
        }

        stage('Build') {
            steps {
                sh '''
                    docker compose build --no-cache
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose up -d
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                    sleep 10
                    docker compose ps
                '''
            }
        }
    }

    post {
        success {
            echo 'SITE deployment completed successfully.'
        }

        failure {
            echo 'SITE deployment failed.'
            sh 'docker compose logs --tail=100 || true'
        }

        always {
            sh 'docker compose ps || true'
        }
    }
}
