# Use an official Node.js runtime as a base image
FROM node:18.16.0

# Set the working directory in the container
WORKDIR /usr/src/index

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Command to run your application
CMD ["node", "index.js"]
