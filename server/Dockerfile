# Base image for backend
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install 

# Install nodemon
RUN npm install -g nodemon 

# Copy the rest of the backend code
COPY . .

# Expose backend development port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]