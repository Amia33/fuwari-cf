---
title: Install Grafana alloy on Ubuntu 24.04 LTS
published: 2025-05-08
description: "Steps to install alloy"
image: ""
tags: [Linux, Ubuntu, Grafana, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [Install Grafana Alloy on Linux | Grafana Alloy documentation](https://grafana.com/docs/alloy/latest/set-up/install/linux/)

:::

<!-- more -->

## Prerequisites

```zsh
apt install -y gpg
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | tee /usr/share/keyrings/grafana.gpg > /dev/null
```

## Set up apt repository

Edit `/etc/apt/sources.list.d/grafana.sources`.

```yaml
Types: deb
URIs: https://apt.grafana.com
Suites: stable
Components: main
Signed-By: /usr/share/keyrings/grafana.gpg
```

## Install packages

```zsh
apt update
apt install -y alloy
systemctl enable --now alloy
```
