---
sidebar_position: 2
---

# Download clients

Listenarr currently supports these download clients:

- `qBittorrent`
- `Transmission`
- `SABnzbd`
- `NZBGet`

Open `Settings -> Download Clients` to add or edit them.

## Recommended setup order

Before you save a client in Listenarr, make sure you already know:

- the host and port Listenarr should connect to
- whether the client requires SSL
- the username and password or API key
- the download path as seen by the client
- whether Listenarr and the client see the same filesystem paths

If the client and Listenarr do **not** see the same paths, plan to add remote path mappings after the client is created.

## Common fields

Every client uses the same core sections.

### Activation

- `Enable`: turns the client on or off without deleting it

### Basic

- `Name`: friendly label shown in Listenarr
- `Type`: qBittorrent, Transmission, SABnzbd, or NZBGet
- `Host`: hostname or IP of the client
- `Port`: the web or RPC port for that client
- `Download Path`: optional override for the client's default save path
- `Use SSL`: use HTTPS when the client is exposed securely

Transmission adds one extra field:

- `URL Base`: RPC path, usually `/transmission/rpc`

### Authentication

Listenarr uses different auth inputs depending on the client:

- `SABnzbd`: API key
- `qBittorrent`: username and password when Web UI auth is enabled
- `Transmission`: username and password if your RPC is protected
- `NZBGet`: username and password; required when NZBGet auth is enabled

### Category and tags

- `Category`: highly recommended so Listenarr downloads are separated from unrelated traffic
- `Tags`: available for torrent clients; leave blank unless you intentionally route jobs by tags

### Priority

Listenarr stores two priority values:

- `Recent Priority`
- `Older Priority`

These follow the usual `arr`-style grab priority rules so newer and older releases can be handled differently.

### Completed Download Handling

- `None - Keep in client`: import the files but leave the download in the client
- `Remove - Remove from client`: remove the job after a successful import
- `Remove and Delete - Remove from client and delete files`: only use this if you are certain the library import is working exactly as expected

For Usenet clients, Listenarr also shows legacy toggles:

- `Remove Completed (Legacy)`
- `Remove Failed (Legacy)`

## Client-specific notes

### qBittorrent

Default web UI port: `8080`

Advanced options:

- `Initial State`: start, force start, pause, or use qBittorrent defaults
- `Sequential Order`
- `First and Last First`
- `Content Layout`

Use these only if you already understand how qBittorrent handles torrent layout and piece ordering.

### Transmission

Default RPC port: `9091`

If your provider uses a custom RPC path, set `URL Base` accordingly. The default is `/transmission/rpc`.

### SABnzbd

Default web port: `8080`

SABnzbd uses an API key instead of username/password in Listenarr. A dedicated category such as `audiobooks` is strongly recommended.

### NZBGet

Default web port: `6789`

Use the NZBGet RPC credentials. If auth is enabled in NZBGet, the username and password must match those RPC settings.

## Test before save

Use the `Test` button before saving. If the test fails:

- verify the host and port
- confirm the credentials or API key
- make sure Listenarr can reach the client from its own network namespace
- check SSL settings

For Docker-to-Docker setups, use the other container name or internal network address, not always `localhost`.

## Remote path mappings

Remote path mappings translate the path reported by the download client into the path Listenarr can actually access.

This matters most when:

- Listenarr and the download client run in different containers
- the client runs on another host
- the client writes to a mounted path with a different prefix

Example:

- qBittorrent sees `/downloads`
- Listenarr sees `/data/downloads`

Create a mapping:

- `Remote Path`: `/downloads`
- `Local Path`: `/data/downloads`

### Important limitation

The download client form only lets you attach path mappings after the client already exists. In practice:

1. Save the download client first.
2. Add one or more remote path mappings.
3. Re-open the client and attach the mappings if needed.

### Path mapping fields

- `Name (optional)`: friendly label
- `Remote Path`: path as seen by the download client
- `Local Path`: path as seen by Listenarr

Use the built-in path translation tester after saving a mapping.

## Hardlinks and download clients

If you want hardlinks instead of copies:

- set `Completed File Action` to `Hardlink/Copy` in General Settings
- keep the download path and root folder on the same filesystem or volume
- make sure Listenarr can access the completed files directly

If the source and destination are on different volumes, hardlinks are not possible and Listenarr falls back to copying.

## Recommended categories

A simple category such as `audiobooks` is usually enough. The goal is to keep Listenarr-managed jobs separate so the app can identify and clean up its own downloads without touching unrelated content.
