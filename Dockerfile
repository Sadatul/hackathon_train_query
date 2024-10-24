# Use Node.js official image
FROM node:22-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port (only for api-gateway, not required for other microservices)
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:dev"]
