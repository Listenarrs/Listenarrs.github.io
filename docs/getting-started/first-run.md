---
sidebar_position: 2
---

# First run

After Listenarr is running, use the web UI to connect the pieces that power search, downloads, imports, and notifications.

## Recommended order

1. Configure [root folders](../configuration/root-folders.md) for the finished library.
2. Create or review [quality profiles](../configuration/quality-profiles.md) before large imports.
3. Add a [download client](../configuration/download-clients.md) and set remote path mappings if needed.
4. Add [indexers](../configuration/indexers.md) or import them from Prowlarr.
5. Review [general settings](../configuration/general-settings.md), especially naming patterns and completed file action.
6. Add [notifications](../configuration/notifications.md) if you want external alerts.
7. Set up the [Discord bot](../configuration/discord-bot.md) if you want request-based automation from Discord.

## First-run checklist

### 1. Root folder first

Set the final library destination before testing downloads. This avoids importing books into the wrong place and then having to move them later.

### 2. Decide on your file action early

In General Settings, choose whether imports should:

- move files
- hardlink when possible and copy as fallback

If you want hardlinks, make sure your download client path and root folder live on the same filesystem or volume.

### 3. Save at least one quality profile

Create a profile that matches the formats you actually want. If you prefer AAC-based audiobooks and chapter-friendly files, enable AAC and turn on `Prefer M4B container`.

### 4. Add the download client before the indexers

Search results are more useful once Listenarr knows where it will send grabs. Test the client connection before moving on.

### 5. Add or import indexers

If you already use Prowlarr, import from there instead of duplicating manual indexer setup.

### 6. Review General Settings

Pay special attention to:

- naming patterns
- metadata processing
- OpenLibrary searching
- failed download handling
- authentication

### 7. Test with one book

Before importing a large wishlist, add one book and watch it move through:

- search
- grab
- client download
- import
- library organization

That single end-to-end test will expose path, permission, and category problems early.

## Security note

Listenarr is still actively evolving. If authentication is disabled, keep the app behind a trusted LAN, VPN, or authenticated reverse proxy.
