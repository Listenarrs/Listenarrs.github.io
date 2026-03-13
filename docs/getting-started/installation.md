---
sidebar_position: 1
---

# Installation

Listenarr supports Docker, self-contained executables, and source-based development workflows. For most users, Docker is the cleanest production setup.

## Docker

Docker is the recommended deployment method for production.

```bash
docker run -d \
  --user 1001:1001 \
  --name listenarr \
  -p 4545:4545 \
  -e LISTENARR_PUBLIC_URL=https://your-domain.com \
  -v listenarr_data:/app/config \
  -v /path/to/audiobooks:/audiobooks \
  -v /path/to/downloads:/downloads \
  ghcr.io/listenarrs/listenarr:canary
```

The web app is available at `http://localhost:4545`.

### What the mounts are for

- `/app/config`: persistent config and database storage
- `/audiobooks`: optional library mount for root folders
- `/downloads`: optional mount so Listenarr can access completed downloads directly

If you use Docker, enter the **container** paths in Listenarr. For example, if you mount `/srv/audiobooks:/audiobooks`, configure the root folder as `/audiobooks`, not `/srv/audiobooks`.

### Docker Compose

```yaml
version: '3.8'

services:
  listenarr:
    image: ghcr.io/listenarrs/listenarr:canary
    user: "1001:1001"
    ports:
      - "4545:4545"
    environment:
      - LISTENARR_LOG_LEVEL=Information
      - LISTENARR_PUBLIC_URL=https://your-domain.com
    volumes:
      - listenarr_data:/app/config
      - /path/to/audiobooks:/audiobooks
      - /path/to/downloads:/downloads
    restart: unless-stopped

volumes:
  listenarr_data:
```

### Docker notes

- `LISTENARR_PUBLIC_URL` is optional for the core app, but strongly recommended if you plan to use the Discord bot.
- If your download client runs in another container and uses different mount paths, you will likely need remote path mappings in Listenarr.
- If you want hardlinks, keep the download folder and library folder on the same underlying filesystem.

## Self-contained executables

Download the latest archive from the [Listenarr releases page](https://github.com/Listenarrs/Listenarr/releases), extract it, then launch the platform-specific binary for your OS.

### Windows

```cmd
cd .\listenarr-win-x64
.\Listenarr.Api.exe
```

### Linux

```bash
cd ./listenarr-linux-x64
chmod +x Listenarr.Api
./Listenarr.Api
```

### macOS

```bash
cd ./listenarr-osx-x64
chmod +x Listenarr.Api
./Listenarr.Api
```

By default, Listenarr serves on `http://localhost:4545`.

### Executable prerequisites

- The releases are self-contained, so you do not need to install .NET separately for the normal executable packages.
- If you plan to use Discord bot functionality outside Docker, keep `Node.js 20.x` or later available.
- If you plan to use the Discord bot or public links, set `LISTENARR_PUBLIC_URL` to your real external URL.

### Override the port

You can change the listener URL at startup:

```bash
./Listenarr.Api --urls "http://localhost:5656"
```

## Build from source

If you want to run the full development stack locally:

```bash
npm run install:all
npm run dev
```

That starts the API on `http://localhost:4545` and the web frontend on `http://localhost:5173`.

## Next

Continue to [First run](./first-run.md) to configure root folders, quality profiles, download clients, indexers, and the main settings.
