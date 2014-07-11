# Telex2000 deployment
> This file lists the instructions I used to deploy this app on a functionning Ubuntu server

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

# Run the app
cd /home/Telex2000-prod/Telex2000/
npm install --production
forever start app.js



