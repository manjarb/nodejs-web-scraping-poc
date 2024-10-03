# Use a base image with Node.js installed
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript project
# RUN npm run build

# Default command just drops into a shell, so you can manually run `npm run fetch`
CMD ["/bin/bash"]
