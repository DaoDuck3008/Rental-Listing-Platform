FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Environment variables will be automatically read from the .env file copied above by Next.js
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID

RUN npm run build

# Expose Next.js default port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
