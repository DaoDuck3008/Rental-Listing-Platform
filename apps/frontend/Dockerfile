FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Environment variables will be automatically read from the .env file copied above by Next.js

RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
