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

# Expose port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]

