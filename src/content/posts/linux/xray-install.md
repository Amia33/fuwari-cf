---
title: Install xray on Ubuntu 24.04 LTS
published: 2025-05-08
description: "Steps to install xray"
image: ""
tags: [Linux, Ubuntu, Xray, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [Environment Variables | Project X](https://xtls.github.io/config/features/env.html)

:::

<!-- more -->

```zsh
bash -c "$(curl -L https://cdn.jsdelivr.net/gh/XTLS/Xray-install/install-release.sh)" @ install --without-geodata -u root
mkdir -p /usr/local/share/xray
wget "https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat" -O /usr/local/share/xray/geosite.dat
wget "https://cdn.jsdelivr.net/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat" -O /usr/local/share/xray/geoip.dat
```
