---
title: Configure Grafana alloy
published: 2025-05-08
description: "Steps to configure alloy"
image: ""
tags: [Linux, Ubuntu, Grafana, Docker, Nginx, tutorial]
category: "Technology"
draft: false
---

:::note
Reference:

- [Linux Server integration | Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-linux-node/)
- [Docker integration | Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-docker/)
- [Nginx integration | Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/integrations/integration-reference/integration-nginx/)

:::

<!-- more -->

## Initialize

Edit `/etc/alloy/config.alloy`.

```lua
prometheus.exporter.self "alloy_check" { }

discovery.relabel "alloy_check" {
targets = prometheus.exporter.self.alloy_check.targets

rule {
  target_label = "instance"
  replacement  = constants.hostname
}

rule {
  target_label = "alloy_hostname"
  replacement  = constants.hostname
}

rule {
  target_label = "job"
  replacement  = "integrations/alloy-check"
}
}

prometheus.scrape "alloy_check" {
targets    = discovery.relabel.alloy_check.output
forward_to = [prometheus.relabel.alloy_check.receiver]

scrape_interval = "60s"
}

prometheus.relabel "alloy_check" {
forward_to = [prometheus.remote_write.metrics_service.receiver]

rule {
  source_labels = ["__name__"]
  regex         = "(prometheus_target_sync_length_seconds_sum|prometheus_target_scrapes_.*|prometheus_target_interval.*|prometheus_sd_discovered_targets|alloy_build.*|prometheus_remote_write_wal_samples_appended_total|process_start_time_seconds)"
  action        = "keep"
}
}

prometheus.remote_write "metrics_service" {
endpoint {
  url = "{URL}"

  basic_auth {
    username = "{USERNAME}"
    password = "{PASSWORD}"
  }
}
}

loki.write "grafana_cloud_loki" {
endpoint {
  url = "{URL}"

  basic_auth {
    username = "{USERNAME}"
    password = "{PASSWORD}"
  }
}
}
```

## Linux server intergration

Edit `/etc/alloy/config.alloy`.

```lua
discovery.relabel "integrations_node_exporter" {
targets = prometheus.exporter.unix.integrations_node_exporter.targets

rule {
  target_label = "instance"
  replacement  = "{INSTANCE}"
}

rule {
  target_label = "job"
  replacement = "integrations/node_exporter"
}
}

prometheus.exporter.unix "integrations_node_exporter" {
disable_collectors = ["ipvs", "btrfs", "infiniband", "xfs", "zfs"]

filesystem {
  fs_types_exclude     = "^(autofs|binfmt_misc|bpf|cgroup2?|configfs|debugfs|devpts|devtmpfs|tmpfs|fusectl|hugetlbfs|iso9660|mqueue|nsfs|overlay|proc|procfs|pstore|rpc_pipefs|securityfs|selinuxfs|squashfs|sysfs|tracefs)$"
  mount_points_exclude = "^/(dev|proc|run/credentials/.+|sys|var/lib/docker/.+)($|/)"
  mount_timeout        = "5s"
}

netclass {
  ignored_devices = "^(veth.*|cali.*|[a-f0-9]{15})$"
}

netdev {
  device_exclude = "^(veth.*|cali.*|[a-f0-9]{15})$"
}
}

prometheus.scrape "integrations_node_exporter" {
targets    = discovery.relabel.integrations_node_exporter.output
forward_to = [prometheus.relabel.integrations_node_exporter.receiver]
}

prometheus.relabel "integrations_node_exporter" {
forward_to = [prometheus.remote_write.metrics_service.receiver]

rule {
  source_labels = ["__name__"]
  regex         = "up|node_arp_entries|node_boot_time_seconds|node_context_switches_total|node_cpu_seconds_total|node_disk_io_time_seconds_total|node_disk_io_time_weighted_seconds_total|node_disk_read_bytes_total|node_disk_read_time_seconds_total|node_disk_reads_completed_total|node_disk_write_time_seconds_total|node_disk_writes_completed_total|node_disk_written_bytes_total|node_filefd_allocated|node_filefd_maximum|node_filesystem_avail_bytes|node_filesystem_device_error|node_filesystem_files|node_filesystem_files_free|node_filesystem_readonly|node_filesystem_size_bytes|node_intr_total|node_load1|node_load15|node_load5|node_md_disks|node_md_disks_required|node_memory_Active_anon_bytes|node_memory_Active_bytes|node_memory_Active_file_bytes|node_memory_AnonHugePages_bytes|node_memory_AnonPages_bytes|node_memory_Bounce_bytes|node_memory_Buffers_bytes|node_memory_Cached_bytes|node_memory_CommitLimit_bytes|node_memory_Committed_AS_bytes|node_memory_DirectMap1G_bytes|node_memory_DirectMap2M_bytes|node_memory_DirectMap4k_bytes|node_memory_Dirty_bytes|node_memory_HugePages_Free|node_memory_HugePages_Rsvd|node_memory_HugePages_Surp|node_memory_HugePages_Total|node_memory_Hugepagesize_bytes|node_memory_Inactive_anon_bytes|node_memory_Inactive_bytes|node_memory_Inactive_file_bytes|node_memory_Mapped_bytes|node_memory_MemAvailable_bytes|node_memory_MemFree_bytes|node_memory_MemTotal_bytes|node_memory_SReclaimable_bytes|node_memory_SUnreclaim_bytes|node_memory_ShmemHugePages_bytes|node_memory_ShmemPmdMapped_bytes|node_memory_Shmem_bytes|node_memory_Slab_bytes|node_memory_SwapTotal_bytes|node_memory_VmallocChunk_bytes|node_memory_VmallocTotal_bytes|node_memory_VmallocUsed_bytes|node_memory_WritebackTmp_bytes|node_memory_Writeback_bytes|node_netstat_Icmp6_InErrors|node_netstat_Icmp6_InMsgs|node_netstat_Icmp6_OutMsgs|node_netstat_Icmp_InErrors|node_netstat_Icmp_InMsgs|node_netstat_Icmp_OutMsgs|node_netstat_IpExt_InOctets|node_netstat_IpExt_OutOctets|node_netstat_TcpExt_ListenDrops|node_netstat_TcpExt_ListenOverflows|node_netstat_TcpExt_TCPSynRetrans|node_netstat_Tcp_InErrs|node_netstat_Tcp_InSegs|node_netstat_Tcp_OutRsts|node_netstat_Tcp_OutSegs|node_netstat_Tcp_RetransSegs|node_netstat_Udp6_InDatagrams|node_netstat_Udp6_InErrors|node_netstat_Udp6_NoPorts|node_netstat_Udp6_OutDatagrams|node_netstat_Udp6_RcvbufErrors|node_netstat_Udp6_SndbufErrors|node_netstat_UdpLite_InErrors|node_netstat_Udp_InDatagrams|node_netstat_Udp_InErrors|node_netstat_Udp_NoPorts|node_netstat_Udp_OutDatagrams|node_netstat_Udp_RcvbufErrors|node_netstat_Udp_SndbufErrors|node_network_carrier|node_network_info|node_network_mtu_bytes|node_network_receive_bytes_total|node_network_receive_compressed_total|node_network_receive_drop_total|node_network_receive_errs_total|node_network_receive_fifo_total|node_network_receive_multicast_total|node_network_receive_packets_total|node_network_speed_bytes|node_network_transmit_bytes_total|node_network_transmit_compressed_total|node_network_transmit_drop_total|node_network_transmit_errs_total|node_network_transmit_fifo_total|node_network_transmit_multicast_total|node_network_transmit_packets_total|node_network_transmit_queue_length|node_network_up|node_nf_conntrack_entries|node_nf_conntrack_entries_limit|node_os_info|node_sockstat_FRAG6_inuse|node_sockstat_FRAG_inuse|node_sockstat_RAW6_inuse|node_sockstat_RAW_inuse|node_sockstat_TCP6_inuse|node_sockstat_TCP_alloc|node_sockstat_TCP_inuse|node_sockstat_TCP_mem|node_sockstat_TCP_mem_bytes|node_sockstat_TCP_orphan|node_sockstat_TCP_tw|node_sockstat_UDP6_inuse|node_sockstat_UDPLITE6_inuse|node_sockstat_UDPLITE_inuse|node_sockstat_UDP_inuse|node_sockstat_UDP_mem|node_sockstat_UDP_mem_bytes|node_sockstat_sockets_used|node_softnet_dropped_total|node_softnet_processed_total|node_softnet_times_squeezed_total|node_systemd_unit_state|node_textfile_scrape_error|node_time_zone_offset_seconds|node_timex_estimated_error_seconds|node_timex_maxerror_seconds|node_timex_offset_seconds|node_timex_sync_status|node_uname_info|node_vmstat_oom_kill|node_vmstat_pgfault|node_vmstat_pgmajfault|node_vmstat_pgpgin|node_vmstat_pgpgout|node_vmstat_pswpin|node_vmstat_pswpout|process_max_fds|process_open_fds"
  action        = "keep"
}
}
loki.source.journal "logs_integrations_integrations_node_exporter_journal_scrape" {
max_age       = "24h0m0s"
relabel_rules = discovery.relabel.logs_integrations_integrations_node_exporter_journal_scrape.rules
forward_to    = [loki.write.grafana_cloud_loki.receiver]
}

local.file_match "logs_integrations_integrations_node_exporter_direct_scrape" {
path_targets = [{
  __address__ = "localhost",
  __path__    = "/var/log/{syslog,messages,**/*.log}",
  instance    = "{INSTANCE}",
  job         = "integrations/node_exporter",
}]
}

discovery.relabel "logs_integrations_integrations_node_exporter_journal_scrape" {
targets = []

rule {
  source_labels = ["__journal__systemd_unit"]
  target_label  = "unit"
}

rule {
  source_labels = ["__journal__boot_id"]
  target_label  = "boot_id"
}

rule {
  source_labels = ["__journal__transport"]
  target_label  = "transport"
}

rule {
  source_labels = ["__journal_priority_keyword"]
  target_label  = "level"
}
}

loki.source.file "logs_integrations_integrations_node_exporter_direct_scrape" {
targets    = local.file_match.logs_integrations_integrations_node_exporter_direct_scrape.targets
forward_to = [loki.write.grafana_cloud_loki.receiver]
}
```

## Docker intergration

### Prerequisites

Add user `alloy` to `docker` user group by running `usermod -a -G docker alloy`.

Edit `alloy` service configuration by running `systemctl edit --full alloy.service`.

```diff
- User=alloy
+ User=root
```

Run `systemctl daemon-load` and `systemctl restart alloy` to make changes take effect.

### Configure alloy

Edit `/etc/alloy/config.alloy`.

```lua
prometheus.exporter.cadvisor "integrations_cadvisor" {
  docker_only = true
}
discovery.relabel "integrations_cadvisor" {
  targets = prometheus.exporter.cadvisor.integrations_cadvisor.targets

  rule {
      target_label = "job"
      replacement  = "integrations/docker"
  }

  rule {
      target_label = "instance"
      replacement  = "{INSTANCE}"
  }
}

prometheus.relabel "integrations_cadvisor" {
	forward_to = [prometheus.remote_write.metrics_service.receiver]

	rule {
		source_labels = ["__name__"]
		regex         = "up|container_cpu_usage_seconds_total|container_fs_inodes_free|container_fs_inodes_total|container_fs_limit_bytes|container_fs_usage_bytes|container_last_seen|container_memory_usage_bytes|container_network_receive_bytes_total|container_network_tcp_usage_total|container_network_transmit_bytes_total|container_spec_memory_reservation_limit_bytes|machine_memory_bytes|machine_scrape_error"
		action        = "keep"
	}
}

prometheus.scrape "integrations_cadvisor" {
  targets    = discovery.relabel.integrations_cadvisor.output
  forward_to = [prometheus.relabel.integrations_cadvisor.receiver]
}

discovery.docker "logs_integrations_docker" {
  host             = "unix:///var/run/docker.sock"
  refresh_interval = "5s"
}
discovery.relabel "logs_integrations_docker" {
  targets = []

  rule {
      target_label = "job"
      replacement  = "integrations/docker"
  }

  rule {
      target_label = "instance"
      replacement  = "{INSTANCE}"
  }

  rule {
      source_labels = ["__meta_docker_container_name"]
      regex         = "/(.*)"
      target_label  = "container"
  }

  rule {
      source_labels = ["__meta_docker_container_log_stream"]
      target_label  = "stream"
  }
}
loki.source.docker "logs_integrations_docker" {
  host             = "unix:///var/run/docker.sock"
  targets          = discovery.docker.logs_integrations_docker.targets
  forward_to       = [loki.write.grafana_cloud_loki.receiver]
  relabel_rules    = discovery.relabel.logs_integrations_docker.rules
  refresh_interval = "5s"
}
```

## Nginx intergration

### Check nginx configuration

Edit `/etc/nginx/nginx.conf`.

```diff
+ load_module modules/ngx_http_geoip2_module.so;

http {
+   log_format json_analytics escape=json '{'
+   '"msec": "$msec", '
+   '"connection": "$connection", '
+   '"connection_requests": "$connection_requests", '
+   '"pid": "$pid", '
+   '"request_id": "$request_id", '
+   '"request_length": "$request_length", '
+   '"remote_addr": "$remote_addr", '
+   '"remote_user": "$remote_user", '
+   '"remote_port": "$remote_port", '
+   '"time_local": "$time_local", '
+   '"time_iso8601": "$time_iso8601", '
+   '"request": "$request", '
+   '"request_uri": "$request_uri", '
+   '"args": "$args", '
+   '"status": "$status", '
+   '"body_bytes_sent": "$body_bytes_sent", '
+   '"bytes_sent": "$bytes_sent", '
+   '"http_referer": "$http_referer", '
+   '"http_user_agent": "$http_user_agent", '
+   '"http_x_forwarded_for": "$http_x_forwarded_for", '
+   '"http_host": "$http_host", '
+   '"server_name": "$server_name", '
+   '"request_time": "$request_time", '
+   '"upstream": "$upstream_addr", '
+   '"upstream_connect_time": "$upstream_connect_time", '
+   '"upstream_header_time": "$upstream_header_time", '
+   '"upstream_response_time": "$upstream_response_time", '
+   '"upstream_response_length": "$upstream_response_length", '
+   '"upstream_cache_status": "$upstream_cache_status", '
+   '"ssl_protocol": "$ssl_protocol", '
+   '"ssl_cipher": "$ssl_cipher", '
+   '"scheme": "$scheme", '
+   '"request_method": "$request_method", '
+   '"server_protocol": "$server_protocol", '
+   '"pipe": "$pipe", '
+   '"gzip_ratio": "$gzip_ratio", '
+   '"geoip_country_code": "$geoip2_data_country_code"'
+   '}';

+   geoip2 /etc/nginx/GeoLite2-Country.mmdb {
+       $geoip2_data_country_code default={COUNTRY} source=$remote_addr country iso_code;
+   }
}
```

Edit each site's configuration file which `access_log` is enabled.

```diff
-   access_log              /var/log/nginx/access.log combined buffer=512k flush=1m;
+   access_log              /var/log/nginx/json_access.log json_analytics buffer=512k flush=1m;
```

### Compile geoip2 module

```zsh
apt install -y libmaxminddb0 libmaxminddb-dev mmdb-bin build-essential libpcre3-dev zlib1g-dev libssl-dev libxml2-dev libxslt-dev libgd-dev
wget https://nginx.org/download/nginx-{VERSION}.tar.gz
tar zxvf nginx-{VERSION}.tar.gz
cd nginx-{VERSION}
git clone https://github.com/leev/ngx_http_geoip2_module.git
./configure --with-compat --add-dynamic-module=./ngx_http_geoip2_module
make modules
```

Copy `objs/ngx_http_geoip2_module.so` to `/etc/nginx/modules/`.  
Download `GeoLite2 country` database from [MAXMIND](https://www.maxmind.com/en/home), and put `GeoLite2-Country.mmdb` into `/etc/nginx/`.

### Enable stub status module

Edit `/etc/nginx/conf.d/default.conf`.

```nginx
server {
    listen {PORT};
    listen [::]:{PORT};
    server_name localhost;

    location /stub_status {
        stub_status on;
    }
}
```

Remember to restart `nginx` to make changes take effect.

## Alloy configuration

```lua
local.file_match "logs_integrations_integrations_nginx" {
	path_targets = [{
		__address__ = "localhost",
		__path__    = "/var/log/nginx/json_access.log",
		instance    = "{INSTANCE}",
		job         = "integrations/nginx",
	}]
}

loki.source.file "logs_integrations_integrations_nginx" {
	targets    = local.file_match.logs_integrations_integrations_nginx.targets
	forward_to = [loki.write.grafana_cloud_loki.receiver]
}

discovery.relabel "metrics_integrations_integrations_nginx" {
	targets = [{
		__address__  = "localhost:{PORT}",
	}]

	rule {
		target_label = "instance"
		replacement  = "{INSTANCE}"
	}
}

prometheus.scrape "metrics_integrations_integrations_nginx" {
  targets    = discovery.relabel.metrics_integrations_integrations_nginx.output
  forward_to = [prometheus.remote_write.metrics_service.receiver]
  job_name   = "integrations/nginx"
}
```
