---
title: Use nginx to access vaultwarden securely
published: 2025-05-08
description: 'Steps to securely access vaultwarden'
image: ''
tags: [Linux, Ubuntu, Nginx, Vaultwarden, tutorial]
category: 'Technology'
draft: false 
---

:::note
Reference:

- [Home · dani-garcia/vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)

:::

<!-- more -->

## Configure nginx

:::tip
Remember to restart `nginx` to make changes take effect.
:::

### Main configuration

Edit `/etc/nginx/nginx.conf`.

```diff
    map $http_upgrade $connection_upgrade {
        default upgrade;
-       ""      close;
+       ""      "";
    }
```

### Site configuration

Edit `/etc/nginx/sites-available/{DOMAIN}.conf`.

```diff
+ upstream vaultwarden-default {
+   zone vaultwarden-default 64k;
+   server 127.0.0.1:{PORT};
+   keepalive 2;
+ }
server {
-   include             nginxconfig.io/security.conf;
+   add_header X-XSS-Protection          "1; mode=block" always;
+   add_header X-Content-Type-Options    "nosniff" always;
+   add_header Referrer-Policy           "no-referrer-when-downgrade" always;
+   add_header Content-Security-Policy   "default-src 'self' http: https: ws: wss: data: blob: 'unsafe-inline'; frame-ancestors 'self'; script-src 'self' 'wasm-unsafe-eval';" always;
+   add_header Permissions-Policy        "interest-cohort=()" always;
+   add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
+   location ~ /\.(?!well-known) {
+       deny all;
+   }
}
```

## Vaultwarden configuration

:::tip
Remember to restart `docker compose` to make changes take effect.
:::

```dotenv
ICON_CACHE_FOLDER=icon_cache
TMP_FOLDER=tmp
DOMAIN=https://{DOMAIN}
SIGNUPS_ALLOWED=false
INVITATION_ORG_NAME="{INVITATION_ORG_NAME}"
ICON_SERVICE=bitwarden
LOG_FILE=/data/vaultwarden.log
LOG_LEVEL=error
SMTP_HOST={SMTP_HOST}
SMTP_FROM={SMTP_FROM}
SMTP_FROM_NAME={SMTP_FROM_NAME}
SMTP_USERNAME={SMTP_USERNAME}
SMTP_PASSWORD={SMTP_PASSWORD}
SMTP_SECURITY=force_tls
SMTP_PORT=465
SMTP_AUTH_MECHANISM=Login
```

## Setup daily backup

Edit `backup.sh`

```zsh
#!/bin/bash
/usr/bin/rclone sync --config /home/{USER}/.config/rclone/rclone.conf -v --create-empty-src-dirs /home/{USER}/vaultwarden cloudflare:vaultwarden
/usr/bin/rclone sync --config /home/{USER}/.config/rclone/rclone.conf -v --create-empty-src-dirs /home/{USER}/rustdesk cloudflare:rustdesk
```

Run `crontab -e` to edit cron service.  
Press `Enter` if prompted.

```diff
+ 1 0 * * * "/home/{USER}"/backup.sh
```
