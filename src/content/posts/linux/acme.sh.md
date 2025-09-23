---
title: Use acme.sh to issue domain certificates
published: 2025-05-08
description: "Steps to use acme.sh to issue certs"
image: ""
tags: [Linux, Ubuntu, Acme.sh, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [acmesh-official/acme.sh: A pure Unix shell script implementing ACME client protocol](https://github.com/acmesh-official/acme.sh)
- [dnsapi · acmesh-official/acme.sh Wiki](https://github.com/acmesh-official/acme.sh/wiki/dnsapi)

:::

<!-- more -->

## Install acme.sh

```zsh
apt install -y socat
screen
curl https://get.acme.sh | sh -s email={EMAIL}
```

Close current `screen` session and create new one to continue.

## Issue cert and install to specific path

```zsh
export CF_Token="{CF_TOKEN}"
export CF_Zone_ID="{CF_ZONE_ID}"
acme.sh --issue --dns dns_cf -d {DOMAIN} -d '*.{DOMAIN}'
acme.sh --install-cert -d {DOMAIN} --key-file /etc/ssl/private/{DOMAIN}.key --fullchain-file /etc/ssl/private/{DOMAIN}.crt --reloadcmd "systemctl force-reload nginx"
```
