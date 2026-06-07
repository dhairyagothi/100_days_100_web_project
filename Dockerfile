# Use a lightweight Nginx image to serve static files
FROM nginx:alpine

# Copy all project files into the Nginx html directory
COPY . /usr/share/nginx/html

# Expose port 80 to the outside
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
