pipeline {
    agent any

    environment {
        APP_NAME = "docker-app"
        ENV_NAME = "Docker-app-env"
        S3_BUCKET = "3tier-frontend-vivek"
        VERSION = "v-${BUILD_NUMBER}"
        ZIP_FILE = "app.zip"
    }

    stages {

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
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

        stage('Package Application') {
            steps {
                sh '''
                rm -rf app.zip
                zip -r app.zip backend frontend
                '''
            }
        }

        stage('Upload to S3') {
            steps {
                sh '''
                aws s3 cp app.zip s3://$S3_BUCKET/$ZIP_FILE
                '''
            }
        }

        stage('Create EB Application Version') {
            steps {
                sh '''
                aws elasticbeanstalk create-application-version \
                    --application-name $APP_NAME \
                    --version-label $VERSION \
                    --source-bundle S3Bucket=$S3_BUCKET,S3Key=$ZIP_FILE
                '''
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                sh '''
                aws elasticbeanstalk update-environment \
                    --environment-name $ENV_NAME \
                    --version-label $VERSION
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}
