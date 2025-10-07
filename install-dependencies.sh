#!/bin/bash

# Install required dependencies for visitor logging
echo "Installing dependencies for visitor logging system..."

# Install axios for HTTP requests to audit API
npm install axios

# Install dotenv for environment variable management
npm install dotenv

# Install types for better TypeScript support
npm install --save-dev @types/express

echo "Dependencies installed successfully!"
echo "Don't forget to:"
echo "1. Copy .env.example to .env and configure it"
echo "2. Set your AUDIT_API_KEY"
echo "3. Restart the SSR server"