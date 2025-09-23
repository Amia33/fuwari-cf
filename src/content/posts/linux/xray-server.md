---
title: Configure xray server
published: 2025-05-08
description: "Steps to configure xray server"
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

## Generate parameters

- Run `xray uuid` to generate `client id`.
- Run `xray x25519` to generate `reality privateKey`.
- Run `openssl rand --hex 8` to generate `reality shortId`
- Use [poscat0x04/wgcf-teams](https://github.com/poscat0x04/wgcf-teams) to generate wireguard configuration for Cloudflare Warp.
- Use [MediaUnlockTest](https://unlock.icmp.ing) to check domains that need routing.

## Nginx configuration

Edit `/etc/nginx/nginx.conf`.

```diff
http {
+   set_real_ip_from      unix:;
+   real_ip_header      proxy_protocol;
+   real_ip_recursive   on;
+   map $http_x_forwarded_for $client_ip {
+       "" $remote_addr;
+       "~*(?P<firstAddr>([0-9a-f]{0,4}:){1,7}[0-9a-f]{1,4}|([0-9]{1,3}\.){3}[0-9]{1,3})$" $firstAddr;
+   }
+   ssl_prefer_server_ciphers  on;

-   '"remote_addr": "$remote_addr", '
+   '"remote_addr": "$client_ip", '

    geoip2 /etc/nginx/GeoLite2-Country.mmdb {
-       $geoip2_data_country_code default={COUNTRY} source=$remote_addr country iso_code;
+       $geoip2_data_country_code default={COUNTRY} source=$client_ip country iso_code;
    }
}
```

Remove content in `/etc/nginx/sites-available/{DOMAIN}.conf`, and add content below.

```nginx
server {
    listen              unix:/dev/shm/xray_nginx.sock ssl proxy_protocol backlog=2048 so_keepalive=on;
    http2               on;
    server_name         {DOMAIN};
    root                /var/www/html;

    http2_max_concurrent_streams 1024;
    http2_body_preread_size      128k;
    keepalive_time               2h;
    keepalive_timeout            600s;
    keepalive_requests           2048;
    client_body_buffer_size      1m;
    client_body_timeout          600s;
    client_header_timeout        300s;
    large_client_header_buffers  8 16k;
    proxy_buffering              off;
    proxy_request_buffering      off;

    location /{PATH} {
        grpc_buffer_size                   16k;
        grpc_socket_keepalive              on;
        grpc_read_timeout                  1h;
        grpc_send_timeout                  1h;
        grpc_set_header Connection         "";
        grpc_set_header X-Real-IP          $client_ip;
        grpc_set_header Forwarded          $proxy_add_forwarded;
        grpc_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
        grpc_set_header X-Forwarded-Proto  $scheme;
        grpc_set_header X-Forwarded-Port   $server_port;
        grpc_set_header Host               $host;
        grpc_set_header X-Forwarded-Host   $host;
        grpc_pass                          unix:/dev/shm/xray_xhttp_fallback.sock;
    }

    # additional config
    include nginxconfig.io/general.conf;
}
```

Restart `nginx` to make changes take effect.

## Xray configuration

:::tip
Also, remember to restart `xray` to make changes take effect.
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
      ]
    },
    "servers": [
      "https+local://cloudflare-dns.com/dns-query",
      {
        "address": "localhost",
        "domains": ["ext:geosite.dat:private"],
        "expectIPs": ["ext:geoip.dat:private"]
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
        "outboundTag": "wireguard_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:category-ads-all"],
        "outboundTag": "block_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:private"],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "ip": [
          "1.1.1.1",
          "1.0.0.1",
          "2606:4700:4700::1111",
          "2606:4700:4700::1001",
          "ext:geoip.dat:private"
        ],
        "outboundTag": "direct_outbound"
      },
      {
        "type": "field",
        "domain": [
          "domain:nxtv.jp",
          "domain:unext.jp",
          "ext:geosite.dat:anthropic",
          "ext:geosite.dat:google",
          "ext:geosite.dat:hbo",
          "ext:geosite.dat:hotstar",
          "ext:geosite.dat:openai",
          "ext:geosite.dat:sony",
          "ext:geosite.dat:spotify"
        ],
        "outboundTag": "direct_outbound_v4"
      },
      {
        "type": "field",
        "domain": [
          "ext:geosite.dat:apple",
          "ext:geosite.dat:meta",
          "domain:nhk.jp"
        ],
        "outboundTag": "direct_outbound_v6"
      },
      {
        "type": "field",
        "domain": [
          "ext:geosite.dat:abema",
          "ext:geosite.dat:amazon",
          "ext:geosite.dat:catchplay",
          "ext:geosite.dat:category-games@cn",
          "ext:geosite.dat:dazn",
          "ext:geosite.dat:disney",
          "ext:geosite.dat:dmm",
          "ext:geosite.dat:hulu",
          "ext:geosite.dat:microsoft",
          "ext:geosite.dat:netflix",
          "ext:geosite.dat:niconico",
          "ext:geosite.dat:projectsekai",
          "ext:geosite.dat:purikonejp",
          "ext:geosite.dat:rakuten",
          "ext:geosite.dat:reddit",
          "ext:geosite.dat:tld-cn",
          "ext:geosite.dat:viu",
          "ext:geosite.dat:youtube",
          "domain:wowow.co.jp"
        ],
        "outboundTag": "wireguard_outbound"
      },
      {
        "type": "field",
        "domain": ["ext:geosite.dat:cn"],
        "ip": ["ext:geoip.dat:cn"],
        "outboundTag": "wireguard_outbound"
      },
      {
        "type": "field",
        "ip": ["ext:geoip.dat:cn", "ext:geoip.dat:netflix"],
        "outboundTag": "wireguard_outbound"
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
      "listen": "127.0.0.1",
      "port": "{PORT}",
      "protocol": "socks",
      "settings": {
        "udp": true
      },
      "tag": "socks_inbound",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    },
    {
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "{ID}",
            "email": "{EMAIL}",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none",
        "fallbacks": [
          {
            "dest": "/dev/shm/xray_xhttp_fallback.sock"
          }
        ]
      },
      "streamSettings": {
        "security": "reality",
        "realitySettings": {
          "show": false,
          "target": "/dev/shm/xray_nginx.sock",
          "xver": 1,
          "serverNames": ["{SERVERNAME}"],
          "privateKey": "{PRIVATEKEY}",
          "shortIds": ["{SHORTID}"],
          "maxTimeDiff": 60000
        }
      },
      "tag": "reality_inbound",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    },
    {
      "listen": "/dev/shm/xray_xhttp_fallback.sock",
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "{ID}",
            "email": "{EMAIL}"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "xhttp",
        "xhttpSettings": {
          "host": "{HOST}",
          "path": "/{PATH}",
          "mode": "auto"
        }
      },
      "tag": "xhttp_inbound",
      "sniffing": {
        "enabled": true,
        "destOverride": ["http", "tls", "quic"]
      }
    }
  ],
  "outbounds": [
    {
      "tag": "direct_outbound",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"
      }
    },
    {
      "tag": "direct_outbound_v4",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIPv4"
      }
    },
    {
      "tag": "direct_outbound_v6",
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIPv6"
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
    },
    {
      "protocol": "wireguard",
      "settings": {
        "secretKey": "{SECRETKEY}",
        "address": ["{ADDRESS6}", "{ADDRESS4}"],
        "peers": [
          {
            "publicKey": "{PUBLICKEY}",
            "allowedIPs": ["::/0", "0.0.0.0/0"],
            "endpoint": "{ENDPOINT}"
          }
        ],
        "reserved": ["{RESERVED1}", "{RESERVED2}", "{RESERVED3}"],
        "mtu": "{MTU}",
        "domainStrategy": "ForceIPv4v6"
      },
      "tag": "wireguard_outbound"
    }
  ]
}
```
