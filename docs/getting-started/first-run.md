---
sidebar_position: 2
---

# First run

After Listenarr is running, use the web UI to connect the services that power your workflow.

## Recommended order

1. Configure one or more root folders for your audiobook library.
2. Connect your preferred download client.
3. Add torrent or NZB indexers.
4. Review metadata and file-management settings.
5. Enable notifications if you want status updates outside the app.

## Root folders

Root folders tell Listenarr where finished audiobooks should live. Choose locations with enough disk space and predictable permissions, especially when using Docker bind mounts.

## Download clients

Listenarr works with qBittorrent, Transmission, SABnzbd, and NZBGet. Make sure the paths exposed to Listenarr match the paths your download client actually writes to. If they differ across containers or hosts, set up remote path mappings early.

## Indexers and search

Connect the indexers you trust, verify credentials, then test searches from the UI. Listenarr can search across multiple sources while preserving quality-profile and filtering rules.

## Metadata and organization

Review naming patterns, metadata sources, and library import behavior before you start bulk importing. That prevents avoidable cleanup later.

## Security note

Listenarr is still actively evolving. If authentication is disabled, keep the app behind a trusted LAN, VPN, or authenticated reverse proxy.
