FROM node:20-alpine

# Set working directory
WORKDIR /app

# Update npm to latest version
RUN npm install -g npm@latest

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build || true

# Expose port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]

