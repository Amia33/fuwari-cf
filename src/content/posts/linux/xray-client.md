---
title: Configure xray client
published: 2025-05-08
description: "Steps to configure xray client"
image: ""
tags: [Linux, Ubuntu, Xray, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [Configurations | Project X](https://xtls.github.io/config/)

:::

<!-- more -->

:::tip
Remember to restart `xray` to make changes take effect.
:::

Edit `/usr/local/etc/xray/config.json`.

```json
{
  "log": {
    "access": "none",
    "error": "/var/log/xray/error.log",
    "loglevel": "error"
  },
  "dns": {
    "hosts": {
      "cloudflare-dns.com": [
        "1.1.1.1",
        "1.0.0.1",
        "2606:4700:4700::1111",
        "2606:4700:4700::1001"
      ],
      "doh.pub": ["1.12.12.21", "120.53.53.53"]
    },
    "servers": [
      "https://cloudflare-dns.com/dns-query",
      {
        "address": "localhost",
        "domains": ["ext:geosite.dat:private"],
        "expectIPs": ["ext:geoip.dat:private"]
      },
      {
        "address": "https://cloudflare-dns.com/dns-query",
        "domains": ["ext:geosite.dat:google", "ext:geosite.dat:apple"]
      },
      {
        "address": "https://doh.pub/dns-query",
        "domains": [
          "ext:geosite.dat:tld-cn",
          "ext:geosite.dat:category-games@cn"
        ]
      },
      {
        "address": "https://cloudflare-dns.com/dns-query",
        "domains": ["ext:geosite.dat:geolocation-!cn"],
        "expectIPs": ["ext:geoip.dat:!cn"]
      },
      {
        "address": "https://doh.pub/dns-query",
        "domains": ["ext:geosite.dat:cn"],
        "expectIPs": ["ext:geoip.dat:cn"]
      }
    ],
    "disableFallbackIfMatch": true,
    "tag": "dns"
  },
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "domainMatcher": "hybrid",
    "rules": [
      {
        "type": "field",
        "inboundTag": ["socks_inbound"],
        "outboundTag": "xhttp_outbound"
      },
      {
        "type": "field",
        "protocol": ["bittorrent"],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:category-ads-all"],
        "outboundTag": "block_outbound"
      },
      {
        "type": "field",
        "ip": ["1.12.12.21", "120.53.53.53", "ext:geoip.dat:private"],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:private"],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "ip": [
          "ext:geoip.dat:google",
          "1.1.1.1",
          "1.0.0.1",
          "2606:4700:4700::1111",
          "2606:4700:4700::1001"
        ],
        "outboundTag": "xhttp_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:google", "ext:geosite.dat:apple"],
        "outboundTag": "xhttp_outbound"
      },
      {
        "type": "field",
        "domain": [
          "ext:geosite.dat:tld-cn",
          "ext:geosite.dat:category-games@cn"
        ],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:geolocation-!cn"],
        "ip": ["ext:geoip.dat:!cn"],
        "outboundTag": "xhttp_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:cn"],
        "ip": ["ext:geoip.dat:cn"],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "ip": ["ext:geoip.dat:cn"],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "network": "tcp,udp",
        "outboundTag": "direct_outbound"
      }
    ]
  },
  "inbounds": [
    {
      "port": "{PORT}",
      "protocol": "socks",
      "tag": "socks_inbound",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    }
  ],
  "outbounds": [
    {
      "tag": "xhttp_outbound",
      "protocol": "vless",
      "settings": {
        "vnext": [
          {
            "address": "{ADDRESS}",
            "port": 443,
            "users": [
              {
                "id": "{ID}",
                "encryption": "none"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "xhttp",
        "security": "reality",
        "realitySettings": {
          "show": false,
          "fingerprint": "edge",
          "serverName": "{SERVERNAME}",
          "publicKey": "{PUBLICKEY}",
          "shortId": "{SHORTID}",
          "spiderX": "/"
        },
        "xhttpSettings": {
          "host": "{HOST}",
          "path": "/{PATH}",
          "mode": "auto"
        }
      }
    },
    {
      "tag": "direct_outbound",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"
      }
    },
    {
      "tag": "block_outbound",
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      }
    }
  ]
}
```
