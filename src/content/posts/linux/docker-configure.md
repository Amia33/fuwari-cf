---
title: Selected docker images and configurations
published: 2025-05-08
description: "Some selected docker images"
image: ""
tags: [Linux, Ubuntu, Docker, tutorial]
category: "Technology"
draft: false
---

:::note
Use `docker-compose.yaml` for better control.

Reference:

- [Arguments - Watchtower](https://containrrr.dev/watchtower/arguments/)
- [Using Docker Compose · dani-garcia/vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki/Using-Docker-Compose)
- [Docker :: Documentation for RustDesk](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/docker/)

:::

<!-- more -->

## containrrr/watchtower

```yaml
services:
  watchtower:
    image: containrrr/watchtower:latest
    container_name: watchtower
    restart: always
    # environment:
    #   - http_proxy=socks5://172.17.0.1:{PORT}
    #   - https_proxy=socks5://172.17.0.1:{PORT}
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --cleanup --rolling-restart --schedule "1 0 * * * *"
```

## dani-garcia/vaultwarden

```yaml
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: always
    ports:
      - {PORT}:80
    volumes:
      - ./vaultwarden:/data
      - ./vaultwarden/env:/.env
```

## globalping/globalping-probe

```yaml
services:
  globalping:
    image: globalping/globalping-probe:latest
    container_name: globalping
    restart: always
    network_mode: host
    logging:
      driver: local
```

## mikolatero/docker-vlmcsd

```yaml
services:
  vlmcsd:
    image: mikolatero/vlmcsd:latest
    container_name: vlmcsd
    restart: always
    ports:
      - {PORT}:1688
```

## nginx/nginx-prometheus-exporter

```yaml
services:
  nginx_exporter:
    image: nginx/nginx-prometheus-exporter:latest
    container_name: nginx_exporter
    restart: always
    ports:
      - {PORT}:9113
    command: --nginx.scrape-uri=http://172.17.0.1:{PORT}/stub_status
```

## rustdesk/rustdesk-server

```yaml
services:
  rustdesk_hbbs:
    image: rustdesk/rustdesk-server:latest
    command: hbbs
    environment:
      - ALWAYS_USE_RELAY=Y
    volumes:
      - ./rustdesk:/root
    container_name: rustdesk_hbbs
    restart: always
    ports:
      - {PORT}:21115
      - {PORT}:21116
      - "{PORT}:21116/udp"
    depends_on:
      - rustdesk_hbbr
  rustdesk_hbbr:
    image: rustdesk/rustdesk-server:latest
    command: hbbr
    volumes:
      - ./rustdesk:/root
    container_name: rustdesk_hbbr
    restart: always
    ports:
      - {PORT}:21117
```
