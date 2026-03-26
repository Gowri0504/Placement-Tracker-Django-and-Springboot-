# Stage 1: Build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Improve npm install reliability and fix network issues (ECONNRESET)
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./

# Install dependencies with flags for better compatibility and reliability
RUN npm install --legacy-peer-deps --no-audit --prefer-offline

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
