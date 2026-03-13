---
sidebar_position: 2
---

# Development notes

This docs site is intentionally coupled to the Listenarr repository so the API reference stays current with the product.

## Sync process

The `scripts/sync-listenarr.mjs` script:

1. Publishes the Listenarr API into a temporary directory.
2. Boots the published API in development mode.
3. Fetches the OpenAPI document and Swagger UI assets from that running instance.
4. Writes the bundled API files into this site's `static/api-ui/` directory.
5. Refreshes the generated Listenarr version metadata used by the homepage.

## Local sync

Run the sync script against a local Listenarr checkout:

```bash
npm run sync:listenarr -- --repo ../Listenarr
```

If you point the script at another checkout or tag, the docs build will bundle that ref instead.
