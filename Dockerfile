# Build stage
FROM node:18-alpine AS build
ARG ENV_NAME=production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build the SSR application
RUN npm run build:ssr

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy the built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies (including geoip-lite)
RUN npm ci --production --legacy-peer-deps

# Copy geoip data files from build stage
# The data files should exist after npm ci in the build stage
COPY --from=build /app/node_modules/geoip-lite/data /app/node_modules/geoip-lite/data

# Try to update geoip database (optional - will fail without license key)
# The application will work without the database update, just without geolocation
RUN cd node_modules/geoip-lite && npm run-script updatedb || echo "GeoIP database update skipped (requires license key)"

# Ensure geoip data directory exists
RUN ls -la node_modules/geoip-lite/data/ || echo "Warning: GeoIP data files not found"

# Create symlink for geoip data where the app expects it
RUN mkdir -p /app/dist/webapp-ssr && \
    ln -s /app/node_modules/geoip-lite/data /app/dist/webapp-ssr/data || true

# Expose port
EXPOSE 4000

# Set environment variables
ENV PORT=4000

# Start the server
CMD ["npm", "run", "serve:ssr"]