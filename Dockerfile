FROM nginx:1.27.2
RUN mkdir /app
COPY dist/ /app
COPY nginx.conf /etc/nginx/nginx.conf