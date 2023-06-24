# Use an official Node.js 18 runtime as the base image
FROM ghcr.io/puppeteer/puppeteer:20.7.3

# Set the working directory inside the container
WORKDIR /home/pptruser/leetcode-screenshot

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm ci

# create image_cache dir and chown it
RUN mkdir image_cache
RUN chown -R pptruser image_cache
RUN chgrp -R pptruser image_cache

# Copy the rest of the application code
COPY tsconfig.json ./tsconfig.json
COPY src ./src

# Build TypeScript code
RUN npm run build

# Expose the port that the server will listen on
EXPOSE 3000

# Set the command to run when the container starts
CMD ["node", "dist/index.js"]
