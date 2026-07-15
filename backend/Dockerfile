# Use a lightweight Node.js image
FROM node:22-alpine

WORKDIR /usr/src/app

# Install dependencies first
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start:prod"]