---
title: Use zsh instead of bash for default shell
published: 2025-05-08
description: "Steps to change default shell to zsh"
image: ""
tags: [Linux, Ubuntu, Zsh, tutorial]
category: "Technology"
draft: false
---

<!-- more -->

## Install zsh

```zsh
apt install -y zsh
chsh -s /bin/zsh {USER}
```

Restart login session and choose `0` when prompted.

## Install oh-my-zsh

```zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Edit `.zshrc`.

```diff
- ZSH_THEME=agnoster
+ ZSH_THEME="powerlevel10k/powerlevel10k"

- plugins=(git dircycle autojump)
+ plugins=(git sudo extract z wd ubuntu zsh-autosuggestions zsh-syntax-highlighting)
```

Run `source .zshrc` to make changes take effect.  
When prompted, press these keys accordingly: `yyy1y3122112341222y1y`.
