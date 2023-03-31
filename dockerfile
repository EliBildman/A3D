# Build stage
FROM node:16 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install any needed packages
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Build the app for production
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy the built app from the build stage to the Nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
