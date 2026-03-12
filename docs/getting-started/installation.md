---
sidebar_position: 1
---

# Installation

Listenarr supports Docker, self-contained executables, and source-based development workflows.

## Docker

Docker is the fastest path to a production-ready setup.

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

The web application is available at `http://localhost:4545`.

## Self-contained executables

Download the latest archive from the [Listenarr releases page](https://github.com/Listenarrs/Listenarr/releases), extract it, then launch the platform-specific binary:

- Windows: `Listenarr.Api.exe`
- Linux: `./Listenarr.Api`
- macOS: `./Listenarr.Api`

Node.js 20 or later is still required if you plan to use the optional Discord bot helper.

## Build from source

If you want to run the full development stack locally:

```bash
npm run install:all
npm run dev
```

That starts the API on `http://localhost:4545` and the web frontend on `http://localhost:5173`.

## Next

Continue to [First run](./first-run.md) to configure the library, indexers, metadata sources, and download clients.
