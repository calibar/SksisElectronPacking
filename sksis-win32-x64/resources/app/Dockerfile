FROM nginx:alpine
COPY /dist /usr/share/nginx/html/
EXPOSE 80/TCP
RUN nginx


# docker run --name test-w-nginx2 -p 80:80 -d -v ~/Developer/skangular2/dist:/usr/share/nginx/html nginx
# docker run --rm --name test-w-nginx-fr-img -p 80:80 -d 39d1b0f1b400
# docker run -d --rm -p 80:80 web-server
# docker build -t web-server .  
# How does one add ssl certs to a docker image/container?
#   probably using volumes?


# Docker compose can take environment variables.

# Docker network?

#COPY default.conf /etc/nginx/conf.d/default.conf

#     // "build": "webpack --progress --display-error-details --colors true",


#/usr/local/bin/pg_dump --file=/Users/kentwalters/Desktop/db --create --dbname=sasksoil --username=postgres --host=sksoildb.usask.ca --port=5432
