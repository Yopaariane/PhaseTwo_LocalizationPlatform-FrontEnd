FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --output-path=dist/phase-two-localization-platform/browser/browser/

FROM nginx:alpine
COPY --from=build /app/dist/phase-two-localization-platform/browser/browser/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

