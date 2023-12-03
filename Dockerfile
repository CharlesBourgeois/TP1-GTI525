# Stage 1: Build the Angular application
FROM node:19 as build-step
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup the Express server
FROM node:19
WORKDIR /server
COPY --from=build-step /app/dist/tp1-gti525-reseau-cyclabe /server/dist/tp1-gti525-reseau-cyclabe
COPY src/assets src/assets
COPY src/backend package.json package-lock.json ./
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
