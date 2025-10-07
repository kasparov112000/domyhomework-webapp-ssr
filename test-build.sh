#!/bin/bash

echo "========================================="
echo "Testing SSR Build with Visitor Logging"
echo "========================================="

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the SSR application
echo "Building SSR application..."
npm run build:ssr

# Check if build was successful
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build completed successfully!"
  echo ""
  echo "To run the SSR server with visitor logging:"
  echo "  npm run serve:ssr"
  echo ""
  echo "The server will start on http://localhost:4000"
  echo ""
  echo "Visitor logging endpoints:"
  echo "  - GET  /api/visitor-stats    - View today's statistics"
  echo "  - GET  /api/recent-visitors  - View recent visitors"
  echo "  - POST /api/cleanup-logs     - Cleanup old logs"
  echo ""
else
  echo ""
  echo "❌ Build failed! Check the error messages above."
  exit 1
fi