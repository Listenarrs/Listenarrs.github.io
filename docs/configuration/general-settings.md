---
sidebar_position: 7
---

# General settings

The `General Settings` screen is where Listenarr controls file naming, download behavior, metadata features, search augmentation, and authentication.

At the time of writing, the page is split into five sections:

- `File Management`
- `Download Settings`
- `Features`
- `Search Settings`
- `Authentication`

## File Management

This section controls how imported books are organized once they enter your library.

### Folder Naming Pattern

This defines the relative folder structure under the selected root folder.

Example:

```text
{Author}/{Series}/{Title}
```

### Single File Naming Pattern

Used when the audiobook is imported as a single file.

Example:

```text
{Title}
```

### Multi-File Naming Pattern

Used when the audiobook contains multiple files.

Example:

```text
{Title}-{DiskNumber:00}
```

For multi-file imports, include either `DiskNumber` or `ChapterNumber` so each file gets a unique name.

### Supported pattern tokens

Folder patterns support:

- `{Author}`
- `{Series}`
- `{Title}`
- `{SeriesNumber}`
- `{Year}`

File patterns also support:

- `{DiskNumber}`
- `{DiskNumber:00}`
- `{ChapterNumber}`
- `{ChapterNumber:00}`
- `{Quality}`

### Path preview and Windows warning

Listenarr shows a preview and estimates path length. On Windows, very long paths can hit the platform limit. Shorter naming patterns reduce the chance of truncation.

### Completed File Action

Controls what Listenarr does when a download is ready for final library import.

- `Move`: move the files into the library
- `Hardlink/Copy`: try to hardlink, then fall back to copy if hardlinking is not possible

Use `Hardlink/Copy` when you want to preserve seeding and save disk space, but keep the download location and root folder on the same filesystem if you want real hardlinks.

## Download Settings

This section controls concurrency, polling, and failure handling.

### Max Concurrent Downloads

How many downloads Listenarr should run at the same time.

### Unmatched Scan Concurrency

How many `ffprobe` processes Listenarr can run in parallel during unmatched-file scans. Lower values reduce disk and NAS pressure.

### Polling Interval (seconds)

How often Listenarr checks the download client for progress and completion.

### Download Completion Stability (seconds)

How long a download must remain complete before Listenarr begins finalization. Increase this if your client does post-processing after reaching 100%.

### Missing-source Retry Initial Delay (seconds)

If Listenarr sees a completed job but the files are not yet present, this is the initial delay before retrying.

### Missing-source Max Retries

Maximum retry attempts when source files are temporarily missing during finalization.

### Enable Failed Download Handling

When enabled, Listenarr records failed downloads, removes them from the client, and marks the history accordingly.

### Auto-search on Failed Downloads

When enabled, Listenarr automatically looks for a replacement after a failed download. This depends on failed-download handling being enabled.

## Features

This section controls higher-level app behavior.

### Enable Metadata Processing

Fetches and embeds audiobook metadata during imports. In practice this is where Listenarr's metadata pipeline comes into play, including providers such as Audimeta and Audnexus.

### Enable Cover Art Download

Downloads and embeds cover art when metadata processing has a suitable image source.

### Enable Notifications

Global master switch for the notifications system. Your webhook entries can still exist while this is off, but Listenarr will not emit notification events.

### Show completed external downloads in Activity

When enabled, completed jobs from external clients remain visible in the Activity view. Disable it if you want a cleaner activity list after imports finish.

## Search Settings

This section is currently small in the UI but important for metadata behavior.

### Enable OpenLibrary Searching

Adds OpenLibrary augmentation and lookups during intelligent search workflows.

Practical effect:

- better title and identifier augmentation for some books
- another metadata source when Listenarr is resolving search results

### Metadata source note

The current General Settings page exposes the OpenLibrary toggle directly. Listenarr also uses Audimeta and Audnexus in the broader metadata pipeline, but those provider details are mostly handled behind the scenes rather than exposed as separate toggles on this page.

## Authentication

This section controls login behavior and the server API key.

### Enable login screen

This reflects the server's `AuthenticationRequired` startup setting.

When you save it successfully, Listenarr writes the startup config to `config/config.json`. If the server cannot write that file, the UI attempts to download a `config.json` copy so you can place it manually on the host.

### Hide no-auth security warning banner

This hides the warning banner in the current browser when authentication is disabled. It is a local browser preference and applies immediately without needing Save.

### Admin Account Management

When authentication is enabled, this lets you set:

- `Admin username`
- `Admin password`

Use it to create or update the admin account used for the login screen.

### API Key (Server)

This is the API key for external applications and scripts. You can generate or regenerate it from the settings UI.

## Practical recommendations

- Keep naming patterns simple until your first imports look correct.
- Use `Hardlink/Copy` only when your storage layout supports it.
- Leave authentication enabled if the app is reachable outside a trusted LAN or VPN.
- Turn on OpenLibrary search unless you have a specific reason not to.
