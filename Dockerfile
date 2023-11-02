# Stage 1: Build the Angular application
FROM node:19 as build-step
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY --from=build-step /app/dist/tp1-gti525-reseau-cyclabe /usr/share/nginx/html
