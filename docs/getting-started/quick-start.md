---
sidebar_position: 1
---

# Quick start

This is the fastest path from a fresh Listenarr install to your first successful audiobook import.

## 1. Get Listenarr running

Pick one:

- Follow [Installation](./installation.md) for Docker, Windows, Linux, or macOS
- Or download the latest release directly from [GitHub Releases](https://github.com/Listenarrs/Listenarr/releases/latest)

When the app is online, open:

```text
http://localhost:4545
```

## 2. Add a root folder

Open `Settings -> Root Folders` and create the library destination where finished audiobooks should live.

Examples:

- Docker: `/audiobooks`
- Linux: `/srv/media/audiobooks`
- macOS: `/Volumes/Media/Audiobooks`
- Windows: `D:\Audiobooks`

Use the path Listenarr can actually see.

More detail: [Root folders](../configuration/root-folders.md)

## 3. Create or review a quality profile

Open `Settings -> Quality Profiles` and make sure you have at least one profile you actually want to use.

Good first choices:

- broad profile for “any acceptable audiobook”
- higher-quality profile for preferred upgrades
- AAC-based profile with `Prefer M4B container` if chapter-friendly M4B files matter to you

More detail: [Quality profiles](../configuration/quality-profiles.md)

## 4. Add a download client

Open `Settings -> Download Clients` and add one of:

- qBittorrent
- Transmission
- SABnzbd
- NZBGet

Use the `Test` button before saving.

If Listenarr and the download client use different paths, plan to add remote path mappings immediately after.

More detail: [Download clients](../configuration/download-clients.md)

## 5. Add indexers

Open `Settings -> Indexers` and either:

- add Torznab, Newznab, MyAnonamouse, or Internet Archive manually
- import audiobook-ready indexers from Prowlarr

Use `Test` on at least one indexer before moving on.

More detail: [Indexers](../configuration/indexers.md)

## 6. Review General Settings

Before you start importing books, check:

- naming patterns
- completed file action
- metadata processing
- OpenLibrary searching
- failed download handling
- authentication

More detail: [General settings](../configuration/general-settings.md)

## 7. Test one book end to end

Add a single book and verify the full pipeline:

1. Search works
2. The release is sent to your download client
3. The completed download is imported
4. The files land in the right root folder
5. The naming pattern looks correct

If that works, the rest of the setup is usually straightforward.

## 8. Optional extras

After the core flow works, add:

- [Notifications](../configuration/notifications.md)
- [Discord bot](../configuration/discord-bot.md)

## Next step

If you want the fuller guided sequence after this page, continue to [First run](./first-run.md).
