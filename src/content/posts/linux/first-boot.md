---
title: Initialization for Ubuntu 24.04 LTS VPS
published: 2025-05-07
description: "Things to do with brand new Ubuntu system"
image: ""
tags: [Linux, Ubuntu, tutorial]
category: "Technology"
draft: false
---

<!-- more -->

## Initial step

```zsh
nano /etc/motd
pro attach {UBUNTU_PRO_KEY}
dpkg-reconfigure tzdata
dpkg-reconfigure locales
dpkg-reconfigure unattended-upgrades
apt install -y fail2ban
```

## Change to no-password-required for sudo users

Run `visudo` to edit.

```diff
- %sudo   ALL=(ALL:ALL) ALL
+ %sudo   ALL=(ALL:ALL) NOPASSWD:ALL
```

## Change package mirrors

Remove all content in `/etc/apt/sources.list`, then edit `/etc/apt/sources.list.d/ubuntu.sources`.  
Remove all content, then add content below.

```yaml
Types: deb
URIs: https://archive.ubuntu.com/ubuntu
Suites: noble noble-updates noble-backports
Components: main restricted universe multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: https://security.ubuntu.com/ubuntu/
Suites: noble-security
Components: main restricted universe multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

Run `apt update` to refresh package cache.

## Optional: set proxy for apt

Edit `/etc/apt/apt.conf.d/50proxy`.

```cpp
Acquire::http::Proxy "socks5h://127.0.0.1:{PORT}";
Acquire::https::Proxy "socks5h://127.0.0.1:{PORT}";
Acquire::socks::Proxy "socks5h://127.0.0.1:{PORT}";
```

## Optional: set static IP

Edit `/etc/netplan/01-netcfg.yml`.

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    ens5:
      dhcp4: no
      dhcp6: no
      accept-ra: no
      ipv6-privacy: no
      addresses:
        - { IPV4/NETMASK4 }
        - { IPV6/NETMASK6 }
      routes:
        - to: 0.0.0.0/0
          via: { GATEWAY4 }
        - to: ::/0
          via: { GATEWAY6 }
      nameservers:
        addresses:
          - 1.1.1.1
          - 1.0.0.1
          - 2606:4700:4700::1111
          - 2606:4700:4700::1001
```

Run `chmod 600 /etc/netplan/01-netcfg.yaml` and `netplan try` to make changes take effect.

## Harden sshd config

Edit `/etc/ssh/sshd`.

```ssh-config
Port {PORT}
LogLevel INFO
LoginGraceTime 20
PermitRootLogin no
MaxAuthTries 3
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
KerberosAuthentication no
GSSAPIAuthentication no
AllowAgentForwarding no
AllowTcpForwarding no
X11Forwarding no
PermitUserEnvironment no
ClientAliveInterval 300
ClientAliveCountMax 2
PermitTunnel no
ChallengeResponseAuthentication no
DebianBanner no
Protocol 2
```

:::important
Ubuntu seems to not support restarting `sshd` service, so you have to reboot system to make changes take effect.  
Also, remember to open specific PORT in firewall settings.
:::

## Setup fail2ban service

Edit `/etc/fail2ban/jail.d/defaults-debian.conf`.

```diff
[sshd]
enabled = true
+ port = {PORT}
+ filter = sshd
+ logpath = /var/log/auth.log
+ maxretry = 3
```

Run `systemctl enable --now fail2ban` to make changes take effect.

## Enable BBR congestion

```zsh
update-ca-certificates
wget "https://cdn.jsdelivr.net/gh/ylx2016/Linux-NetSpeed/tcpx.sh" -O tcpx.sh
chmod +x tcpx.sh
./tcpx.sh
```

Choose these options accordingly:

1. "21. 系统配置优化旧"
2. "22. 系统配置优化新"
3. "24. 开启 IPv6"
4. "12. 使用 BBR+FQ_PIE 加速"

Edit `/etc/sysctl.d/10-ipv6-privacy.conf` and change all values from `2` to `0`.  
Edit `/etc/sysctl.d/99-sysctl.conf` and change values of option `net.ipv6.conf.accept_ra` and `net.ipv6.conf.default.accept_ra` from `2` to `0`.  
Finally reboot system to make changes take effect.
