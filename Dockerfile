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

# Install only production dependencies
RUN npm ci --production --legacy-peer-deps

# Copy geoip data files
COPY --from=build /app/node_modules/geoip-lite/data /app/node_modules/geoip-lite/data

# Expose port
EXPOSE 4000

# Set environment variable
ENV PORT=4000

# Start the server
CMD ["npm", "run", "serve:ssr"]