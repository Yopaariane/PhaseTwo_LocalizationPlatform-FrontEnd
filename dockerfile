# Use node to build the Angular app
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build -- --output-path=dist

# Use nginx to serve the Angular app
FROM nginx:alpine
COPY --from=build /app/dist/phase-two-localization-platform /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
