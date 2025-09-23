---
title: Install docker on Ubuntu 24.04 LTS
published: 2025-05-08
description: "Steps to install docker"
image: ""
tags: [Linux, Ubuntu, Docker, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [Ubuntu | Docker Docs](https://docs.docker.com/engine/install/ubuntu/)

:::

<!-- more -->

## Prerequisites

```zsh
apt install -y ca-certificates curl
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /usr/share/keyrings/docker.asc
chmod a+r /usr/share/keyrings/docker.asc
```

## Set up apt repository

Edit `/etc/apt/sources.list.d/docker.sources`.

```yaml
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Signed-By: /usr/share/keyrings/docker.asc
Architectures: amd64
```

## Install packages

```zsh
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
```

## Optional: set proxy for docker

Edit `/etc/docker/deamon.json`.

```json
{
  "proxies": {
    "http-proxy": "socks5://127.0.0.1:{PORT}",
    "https-proxy": "socks5://127.0.0.1:{PORT}",
    "no-proxy": "127.0.0.1/8,172.17.0.0/16"
  }
}
```

Run `systemctl restart docker` to make changes take effect.
