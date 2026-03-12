---
sidebar_position: 2
---

# Development notes

This docs site is intentionally coupled to the Listenarr repository so the API reference stays current with the product.

## Sync process

The `scripts/sync-listenarr.mjs` script:

1. Copies brand assets and screenshots from the Listenarr repository.
2. Publishes the API into a temporary directory.
3. Boots the published API in development mode.
4. Fetches the OpenAPI document and Swagger UI assets.
5. Writes the bundled API files into this site's `static/api/` directory.

## Local sync

Run the sync script against a local Listenarr checkout:

```bash
npm run sync:listenarr -- --repo ../Listenarr
```

If you point the script at another checkout or tag, the docs build will bundle that ref instead.
