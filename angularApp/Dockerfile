FROM node:22.10.0

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN  npm install -g @angular/cli


COPY . .

CMD ["ng", "serve","--host","0.0.0.0","--disable-host-check"]

EXPOSE 4200
 

