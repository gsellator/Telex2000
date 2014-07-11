# Telex2000 deployment
> Instructions I used when deploying this on an Ubuntu server

## Creation of the user who will execute the app
```sh
sudo useradd Telex2000-prod
sudo passwd Telex2000-prod
sudo mkdir /home/Telex2000-prod
sudo chown -Rv Telex2000-prod /home/Telex2000-prod/
sudo mkdir /home/Telex2000-prod/Telex2000
sudo chown -Rv Telex2000-prod /home/Telex2000-prod/Telex2000/ 
# This is not mandatory
sudo adduser Telex2000-prod sudo
```

## Nginx conf file
```.nginxconf
upstream telex.radio97.fr {
    server 127.0.0.1:3030;
}

server {
    listen 80;
    server_name telex.radio97.fr;

    location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy true;

    proxy_pass http://telex.radio97.fr/;
    proxy_redirect off;
    }
}
```

```sh
sudo vi /etc/nginx/sites-available/Telex2000-prod
sudo ln -s /etc/nginx/sites-available/Telex2000-prod /etc/nginx/sites-enabled/
sudo service nginx reload
```

## Deploy the app
Create a file called `.ftppass` at the root of the project formated like this :
```json
{
  "prod": {
    "username": "Telex2000-prod",
    "password": "XXXXXXXXXX"
  }
}
```
Locally, go the the root of Telex2000, install [GruntJS](http://gruntjs.com/) and use it to send the code to your distant server :
```sh
npm install -g grunt-cli 
grunt prod
```


## Run the app on the distant server
```sh
cd /home/Telex2000-prod/Telex2000/
npm install forever -g 
npm install --production
forever start app.js
```