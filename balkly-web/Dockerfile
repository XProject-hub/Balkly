FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL=https://balkly.live/api/v1
ARG NEXT_PUBLIC_APP_URL=https://balkly.live

# Set environment variables for build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./

# Expose port
EXPOSE 3000

# Run production server
CMD ["npm", "run", "start"]

