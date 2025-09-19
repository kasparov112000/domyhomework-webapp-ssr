#!/bin/bash

# Deploy webapp-ssr to Kubernetes

echo "Building and deploying webapp-ssr..."

# Build the Docker image
echo "Building Docker image..."
docker build -t kasparov112000/learnbytesting-webapp-ssr:latest .

# Push to DockerHub
echo "Pushing to DockerHub..."
docker push kasparov112000/learnbytesting-webapp-ssr:latest

# Deploy with Helm
echo "Deploying to Kubernetes..."
helm upgrade --install webapp-ssr ./helm \
  --namespace default \
  --set image.tag=latest

echo "Deployment complete!"
echo "Check status with: kubectl get pods -l app.kubernetes.io/name=webapp-ssr"