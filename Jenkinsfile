pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-north-1'
        ECR_REGISTRY = '936506757750.dkr.ecr.eu-north-1.amazonaws.com'
        BACKEND_IMAGE = 'docker-app'
        FRONTEND_IMAGE = 'frontend-app'
    }

    stages {

        stage('Clone Repo') {
            steps {
                git branch: 'main',
                url: 'https://github.com/vivekkumar1611/docker-app.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $BACKEND_IMAGE:latest ./backend
                docker tag $BACKEND_IMAGE:latest $ECR_REGISTRY/$BACKEND_IMAGE:latest
                '''
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $FRONTEND_IMAGE:latest ./frontend
                docker tag $FRONTEND_IMAGE:latest $ECR_REGISTRY/$FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Login to ECR') {
            steps {
                sh '''
                export AWS_PAGER=""
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin $ECR_REGISTRY
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                docker push $ECR_REGISTRY/$BACKEND_IMAGE:latest
                docker push $ECR_REGISTRY/$FRONTEND_IMAGE:latest
                '''
            }
        }

        stage('Deploy to EKS') {
            steps {
                sh '''
                export AWS_PAGER=""
                kubectl rollout restart deployment backend
                kubectl rollout restart deployment frontend
                '''
            }
        }
    }
}
