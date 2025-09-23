---
title: Use chrony to sync time on Ubuntu 24.04 LTS
published: 2025-05-08
description: "Steps to sync time using chrony"
image: ""
tags: [Linux, Ubuntu, Chrony, NTP, tutorial]
category: "Technology"
draft: false
---

<!-- more -->

## Install chrony

```zsh
apt update
apt install -y chrony
```

## Change NTP server

Edit `/etc/chrony/chrony.conf`.

```diff
- pool ntp.ubuntu.com        iburst maxsources 4
- pool 0.ubuntu.pool.ntp.org iburst maxsources 1
- pool 1.ubuntu.pool.ntp.org iburst maxsources 1
- pool 2.ubuntu.pool.ntp.org iburst maxsources 2
+ server time.cloudflare.com iburst
```

## Restart chrony service and check chrony status

```zsh
systemctl restart chrony
chronyc sources -v
chronyc tracking
```
