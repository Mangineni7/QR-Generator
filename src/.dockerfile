# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Quasar CLI globally
RUN npm install -g @quasar/cli

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vue.js application
RUN quasar build

# Expose port 80 to allow external access to the application
EXPOSE 80

# Define the command to run the application when the container starts
CMD ["quasar", "serve", "-p", "80", "--history"]
