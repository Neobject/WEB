# Base image with Node.js 18
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# App port
EXPOSE 4000

# Start application
CMD ["npm", "start"]
