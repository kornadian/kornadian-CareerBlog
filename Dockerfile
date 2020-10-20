FROM nginx:1.19

COPY ./nginx-default.conf /etc/nginx/conf.d/
COPY . /usr/share/nginx/html

