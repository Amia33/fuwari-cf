---
title: Install nginx on Ubuntu 24.04 LTS
published: 2025-05-08
description: "Steps to install nginx"
image: ""
tags: [Linux, Ubuntu, Nginx, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [nginx: Linux packages](https://nginx.org/en/linux_packages.html#Ubuntu)

:::

<!-- more -->

## Prerequisites

```zsh
apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

## Set up apt repository

Edit `/etc/apt/sources.list.d/nginx.sources`.

```yaml
Types: deb
URIs: https://nginx.org/packages/ubuntu
Suites: noble
Components: nginx
Signed-By: /usr/share/keyrings/nginx-archive-keyring.gpg
Architectures: amd64
```

Run `echo -e "Package: \*\nPin: origin nginx.org\nPin: release o=nginx\nPin-Priority: 900\n" | tee /etc/apt/preferences.d/99nginx` to set up repository pinning to prefer official packages over distribution-provided ones.

## Install packages

```zsh
apt update
apt install -y nginx
systemctl enable --now nginx
```
