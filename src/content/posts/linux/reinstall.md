---
title: Reinstall Ubuntu 24.04 LTS from CentOS 7 on VPS
published: 2025-05-07
description: "Steps to reinstall Ubuntu 20.04 LTS"
image: ""
tags: [Linux, Ubuntu, CentOS, tutorial]
category: "Technology"
draft: false
---

<!-- more -->

## Update existing system

```zsh
yum update -y
reboot
```

## Download files for net install

:::tip
Ubuntu doesn't offer files for net install anymore since 22.04 LTS, the last version with net install is 20.04 LTS.
:::

```zsh
mkdir /boot/newboot
wget https://archive.ubuntu.com/ubuntu/dists/focal/main/installer-amd64/current/legacy-images/netboot/ubuntu-installer/amd64/linux -O /boot/newboot/linux
wget https://archive.ubuntu.com/ubuntu/dists/focal/main/installer-amd64/current/legacy-images/netboot/ubuntu-installer/amd64/initrd.gz -O /boot/newboot/initrd.gz
```

## Add boot registry

Edit `/etc/grub.d/40_custom`.

```ini
menuentry "NewBoot" {
  set root=(hd0,1)
  linux /boot/newboot/linux
  initrd /boot/newboot/initrd.gz
}
```

Run `grub-mkconfig -o /boot/grub2/grub.cfg` to generate new boot registry.  
Reboot the system with `reboot` and choose `NewBoot` in the GRUB screen.

## Upgrade through LTS versions

```zsh
apt update
apt upgrade -y
apt autoremove --purge
screen
do-release-upgrade
```

Run twice to bump system from Ubuntu 20.04 LTS to 22.04 LTS to 24.04 LTS.
