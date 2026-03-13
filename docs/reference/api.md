---
sidebar_position: 1
---

# API UI

Listenarr ships with a Swagger UI for the REST API. This docs site bundles that UI and the current OpenAPI document directly from the Listenarr repository during the documentation build.

## Open the bundled UI

[Launch the Listenarr API UI](/api/)

## Authentication

The API supports session-token and API-key flows. The bundled Swagger UI includes the same authorization mechanisms exposed by Listenarr's own development Swagger page.

## Refresh behavior

The bundled API UI is regenerated when:

- this documentation site is pushed
- the Listenarr release workflow dispatches a docs rebuild
