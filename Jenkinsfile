pipeline {
    agent any

    environment {
        AWS_REGION = "eu-north-1"
        EB_APP_NAME = "docker-app"
        EB_ENV_NAME = "Docker-app-env"
        S3_BUCKET = "elasticbeanstalk-eu-north-1-936506757750"
    }

    tools {
        nodejs 'node20'
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

        stage('Package Backend') {
            steps {
                dir('backend') {
                    sh 'zip -r app.zip .'
                }
            }
        }

        stage('Deploy to Elastic Beanstalk') {
            steps {
                dir('backend') {
                    sh '''
                    echo "Uploading artifact to S3..."

                    aws s3 cp app.zip s3://$S3_BUCKET/app.zip

                    VERSION=app-${BUILD_NUMBER}

                    echo "Creating EB application version: $VERSION"

                    aws elasticbeanstalk create-application-version \
                      --application-name $EB_APP_NAME \
                      --version-label $VERSION \
                      --source-bundle S3Bucket=$S3_BUCKET,S3Key=app.zip \
                      --region $AWS_REGION

                    echo "Updating environment..."

                    aws elasticbeanstalk update-environment \
                      --environment-name $EB_ENV_NAME \
                      --version-label $VERSION \
                      --region $AWS_REGION
                    '''
                }
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
