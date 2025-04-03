# Use node to build the Angular app
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Use nginx to serve the Angular app
FROM nginx:latest
COPY --from=build /app/dist/phase-two-localization-platform /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
