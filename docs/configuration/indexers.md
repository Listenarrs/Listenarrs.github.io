---
sidebar_position: 3
---

# Indexers

Listenarr supports both manually configured audiobook indexers and importing compatible indexers from Prowlarr.

Open `Settings -> Indexers` to manage them.

## Supported indexer types

Listenarr's indexer form currently supports these built-in implementations:

- `Torznab`
- `Newznab`
- `MyAnonamouse`
- `Internet Archive`

The UI also exposes a `Custom` implementation, but most audiobook setups use one of the four implementations above.

## Add an indexer manually

Every indexer starts with the same core fields:

- `Name`
- `Implementation`
- `Enable`
- `Priority`
- `Maximum Size`
- `Enable Automatic Search`
- `Enable Interactive Search`

Most indexers also support:

- `URL`
- `API Key`
- `Categories`
- `Enable RSS`
- `Minimum Age`

## Torznab and Newznab

Use these for most private or public audiobook indexers.

### Required inputs

- `URL`: the base indexer URL
- `API Key`: if the site uses API auth

### Optional inputs

- `Categories`: comma-separated category IDs
- `Enable RSS`: monitor feed updates
- `Enable Automatic Search`
- `Enable Interactive Search`
- `Priority`: higher priority indexers are searched first
- `Minimum Age`: delay grabs from brand-new releases
- `Maximum Size`

Newznab adds:

- `Retention`: retention in days, mainly relevant for Usenet

If you are unsure about categories, start with them blank and narrow later.

## MyAnonamouse

MyAnonamouse has its own dedicated setup block.

### Required inputs

- `MAM ID`

### Available options

- `Filter`
- `Search in description`
- `Search in series`
- `Search in filenames`
- `Language (numeric id)`
- `Freeleech wedge`
- `Enrich results`
- `Enrich top results`

Listenarr fixes the URL to `https://www.myanonamouse.net` for this implementation.

## Internet Archive

Internet Archive is handled as a public-domain source rather than a private API integration.

Available collections:

- `Librivox (Free Audiobooks)`
- `Audio Books & Poetry`

Notes:

- Internet Archive does not use the normal RSS flow in the Listenarr form.
- It is useful for public-domain content and backfilling classic titles.

## Feature toggles

### Enable RSS

Use this when the provider offers useful RSS updates and you want Listenarr to monitor new releases automatically.

### Enable Automatic Search

Lets Listenarr use the indexer for unattended searches and upgrades.

### Enable Interactive Search

Lets you use the indexer during manual search from the UI.

## Advanced settings

### Priority

Higher-priority indexers are searched first. Use this to prefer your best sources over fallback sources.

### Minimum Age

Useful if you want to avoid grabbing releases the moment they appear.

### Maximum Size

Caps oversized results before they are considered.

### Retention

Shown for Newznab. Use it only if the indexer's retention information matters to your search strategy.

## Test an indexer

Always use `Test` before saving.

If a test fails:

- verify the URL and API key
- make sure the URL is reachable from Listenarr
- confirm the indexer really supports Torznab or Newznab the way you expect
- for MyAnonamouse, verify the MAM ID and search options

## Import indexers from Prowlarr

Listenarr can import audiobook-related indexers directly from Prowlarr.

Open the `Import from Prowlarr` action and enter:

- `Prowlarr URL / IP`
- `Port (optional)`
- `API Key`

### What Listenarr imports

The import only keeps audiobook-related indexers from Prowlarr. In the current implementation, that means indexers carrying audiobook categories `3000` or `3030`.

During import, Listenarr:

- skips duplicates it already knows about
- labels imported entries with ` (Prowlarr)`
- maps Usenet providers to `Newznab`
- maps torrent providers to `Torznab`
- routes requests through the Prowlarr proxy URL

### Prowlarr requirements

Prowlarr must be reachable from Listenarr. If Listenarr runs in Docker, use the address reachable from the Listenarr container, not necessarily the host machine's `localhost`.

### Recommended Prowlarr workflow

1. Finish the indexer setup inside Prowlarr first.
2. Verify those indexers work in Prowlarr.
3. Import them into Listenarr.
4. Test a few imported indexers from Listenarr.

This keeps category and credential management centralized in Prowlarr while still letting Listenarr use those sources.
