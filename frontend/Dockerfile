# --- STAGE 1: Build the application ---
# We'll use a Node.js image to install dependencies and build the app.
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all the application files
COPY . .

# In a multi-stage build for a frontend, we usually run a build command here
# For example:
# RUN npm run build

# --- STAGE 2: Run the application ---
# We'll use the same Node.js image for the runtime.
FROM node:18-alpine AS runner

# Set the working directory inside the container
WORKDIR /app

# Copy the entire /app directory from the builder stage
# This includes the node_modules and all source files
COPY --from=builder /app ./

# Expose port 3000, which is the default port for "npm run start"
EXPOSE 3000

# The command to start the application when the container launches.
# This will run the development server.
CMD ["npm", "run", "start"]
