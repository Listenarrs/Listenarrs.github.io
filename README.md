# Listenarr Docs

Documentation website for Listenarr, built with Docusaurus.

## Local development

```bash
npm install
npm run sync:listenarr -- --repo ../Listenarr
npm run start
```

## Production build

```bash
npm run build
```

The bundled API UI and OpenAPI document are generated from the Listenarr repo by `scripts/sync-listenarr.mjs`.
