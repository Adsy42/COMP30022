# Development Dockerfile for Next.js
FROM node:20-alpine
ENV NODE_ENV=development

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "dev"]