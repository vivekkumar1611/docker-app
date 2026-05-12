pipeline {
    agent any

    tools {
        nodejs "node20"
    }

    environment {
        AWS_DEFAULT_REGION = 'eu-north-1'
    }

    stages {

        stage('Clone Repository') {
            steps {
                checkout scm
            }
        }

        stage('Backend Install') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                dir('backend') {
                    sh '''
                    eb use Docker-app-env
                    eb deploy
                    '''
                }
            }
        }
    }
}
