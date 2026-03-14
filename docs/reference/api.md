---
sidebar_position: 1
---

# API

Listenarr ships with a Swagger UI for the REST API. This docs site publishes a read-only endpoint reference plus the current bundled OpenAPI document generated from the Listenarr repository during the docs build.

## On this docs site

- [Open the API guide](pathname:///api/)
- [Download the bundled OpenAPI JSON](pathname:///api-ui/openapi.json)

The GitHub Pages site is documentation-only. It is useful for reviewing routes, models, and response shapes, but it is not the right place to make live requests against your own Listenarr server.

## Open Swagger on your own instance

Open Swagger on the same origin as your Listenarr app:

```text
http://localhost:5000/swagger/
http://<listenarr-ip>:<port>/swagger/
https://listenarr.example.com/swagger/
https://listenarr.example.com/<urlBase>/swagger/
```

Use that in-instance Swagger page when you want to:

- test requests against your own server
- sign in and work with your instance's own auth flow
- use write endpoints that require the `X-XSRF-TOKEN` flow

## Refresh behavior

The bundled OpenAPI snapshot is regenerated when:

- this documentation site is pushed
- the Listenarr release workflow dispatches a docs rebuild
