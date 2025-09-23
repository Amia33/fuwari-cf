---
title: Use nginxconfig.io to config nginx
published: 2025-05-08
description: "Steps to use nginxconfig.io"
image: ""
tags: [Linux, Ubuntu, Nginx, Nginxconfig.io, tutorial]
category: "Technology"
draft: false
---

<!-- more -->

## Install configuration from nginxconfig.io

```zsh
echo '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' | base64 --decode | tee /etc/nginx/nginxconfig.io-example.com.tar.gz > /dev/null
cd /etc/nginx
tar -czvf nginx_$(date +'%F_%H-%M-%S').tar.gz nginx.conf sites-available/ sites-enabled/ nginxconfig.io/
tar -xzvf nginxconfig.io-example.com.tar.gz | xargs chmod 0644
openssl dhparam -out /etc/nginx/dhparam.pem 2048
mkdir -p /var/www/html/
nginx -t
systemctl reload nginx
```

:::tip
Remember to edit site-specific configuration and upload website files to `/var/www/html` as needed.  
Also, in newer versions of `nginx`, `http2 on;` should be configured seperately.
:::

## Deny access for unknown domains

Edit `/etc/nginx/conf.d/default.conf`.

```nginx
server {
    listen      80 default_server;
    listen      [::]:80 default_server;
    server_name _;
    return      403;
}
```

## Deal with website file permissions

```zsh
chmod -R 755 /var/www/html
chown -R root /var/www/html
nginx -t
systemctl reload nginx
```
