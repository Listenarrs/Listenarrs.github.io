---
sidebar_position: 4
---

# Quality profiles

Quality profiles tell Listenarr which audio formats you want, how those formats should be ranked, and when an existing release should be upgraded.

Open `Settings -> Quality Profiles` to create or edit them.

## What a quality profile controls

A profile combines:

- allowed codecs and bitrates
- the preference order between those qualities
- optional upgrade cutoff behavior
- word filters
- language preferences
- release scoring rules

Assign a default profile if you want new books to pick one automatically.

## Basic information

The profile starts with:

- `Profile Name`
- `Description`
- `Set as default profile`

Use clear names like `Lossless Preferred`, `M4B First`, or `Space Saver`.

## Quality definitions

This is the most important part of the profile.

### Supported codecs and bitrates

Listenarr currently exposes these codec groups:

- `FLAC`
- `MP3`: `320`, `256`, `192`, `128`, `64`, plus VBR
- `AAC`: `320`, `256`, `192`, `128`, `96`, `64`
- `OPUS`: `192`, `128`, `96`, `64`
- `OGG Vorbis`: `320`, `256`, `192`, `128`

Enable the codecs you want first, then drag qualities into the order you prefer.

### Priority order

Qualities higher in the list are more preferred. Only enabled qualities are eligible for download.

Use drag and drop to rank the exact order you want.

### AAC and the M4B toggle

When `AAC` is enabled, Listenarr shows an extra toggle:

- `Prefer M4B container`

This toggle only appears when AAC is part of the profile.

Use it when you want chapter-friendly `.m4b` files to win over other AAC container matches. In the UI, M4B is treated as an AAC-based quality and can appear as `M4B (AAC)`.

## Upgrade until

The profile can upgrade a lower-quality release later if a better match appears.

### Enable Quality Upgrades

- enabled: Listenarr may replace a worse release with a better one
- disabled: Listenarr keeps the first acceptable match

### Upgrade Until

Choose the cutoff quality where upgrades should stop.

Examples:

- no cutoff: keep upgrading whenever something better appears
- cutoff at `AAC 128 kbps`: stop once that quality is reached
- cutoff at `FLAC`: only settle when lossless is available

## Size limits

Use these when you want hard minimum or maximum file sizes.

- `Minimum Size (MB)`
- `Maximum Size (MB)`

Leave them blank for no limit.

## Word filters

These filters shape result scoring and rejection.

### Preferred Words

Releases containing these words get bonus points.

Examples:

- `unabridged`
- `complete`
- `retail`

### Must Contain

At least one of these words must appear for a result to qualify.

Use this carefully. If it is too strict, you may filter out good releases.

### Must Not Contain

Any result containing these words is rejected.

Examples:

- `abridged`
- `radio`
- `dramatized`

## Language preferences

Add preferred languages in the order you want to favor them.

Examples:

- `English`
- `Spanish`
- `German`

This is preference-based, not a replacement for validating whether your indexers actually label language well.

## Release preferences

### Minimum Seeders

Torrent-only safeguard for weakly seeded releases.

### Minimum Score Threshold

Rejects results below your chosen score.

### Prefer newer releases

Adds a freshness bias to newer uploads.

When enabled, you can also set:

- `Maximum Age (Days)`: reject releases older than this value

## Suggested profile ideas

### High quality, chapter-friendly

- enable `FLAC`, `AAC`, `MP3`
- turn on `Prefer M4B container`
- set a cutoff at your preferred AAC or FLAC target

### Space saver

- enable only lower MP3 or AAC bitrates
- set a maximum file size
- disable upgrades

### Any acceptable audiobook

- enable a broad set of codecs
- keep size limits open
- use preferred words like `unabridged`

## Practical advice

- Keep your first profile simple.
- Do not overuse `Must Contain`.
- Turn on the M4B preference if you care about chapter support in AAC-based files.
- If you are new to Listenarr, set one default profile before adding many books.
