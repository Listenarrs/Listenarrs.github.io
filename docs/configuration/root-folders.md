---
sidebar_position: 1
---

# Root folders

Root folders are the top-level library locations where Listenarr stores finished audiobooks. Think of them as the destination roots for your organized library, not the temporary download folders used by qBittorrent, SABnzbd, or other clients.

## Before you add one

Choose a path that:

- is writable by the Listenarr process
- has enough free space for your library
- stays mounted across restarts
- matches the path that Listenarr sees in its own runtime environment

If you are running Docker, that last point matters most. Enter the container path, not the host path. For example, if your bind mount is `-v /srv/audiobooks:/audiobooks`, use `/audiobooks` in Listenarr.

## Add a root folder

Open `Settings -> Root Folders`, then add a folder with:

- `Name`: a friendly label such as `Main Library`, `Archive`, or `Public Domain`
- `Path`: the actual filesystem path Listenarr should write to
- `Set as default root folder`: new books use this root unless you choose another one

Save the folder after browsing or typing the path.

## Recommended layout

Common examples:

- Docker: `/audiobooks`
- Linux: `/srv/media/audiobooks`
- macOS: `/Volumes/Media/Audiobooks`
- Windows: `D:\Audiobooks`

You can create multiple root folders if you want separate storage targets, such as:

- a main library and an archive library
- SSD and HDD tiers
- separate locations for public-domain content and purchased content

## Default root folder

The default badge is more than cosmetic. It is the fallback location Listenarr will use when a book does not explicitly target another root folder.

Use one default root folder for most setups. Add more only when you have a real storage or organizational reason.

## Editing an existing root folder

If you edit a root folder and change its path, Listenarr prompts you to decide whether to move existing files.

- `Move files enabled`: use this when you are migrating the library to a new location
- `Move files disabled`: use this when the path was wrong in Listenarr and the files are already in the correct place
- `Delete empty source` enabled: clean up old folders after a successful move

If you are changing only the display name, no move is needed.

## Deleting a root folder

Deleting a root folder removes the reference from Listenarr. It does not delete your audiobook files from disk.

## Scan for unmatched files

Each root folder includes a `Scan for unmatched files` action. Use it when:

- you already have books on disk that Listenarr did not add itself
- you manually copied files into the library
- imports failed earlier and you want to reconcile the folder contents

This is a good first step before bulk manual cleanup.

## Hardlinks and root folders

If you plan to use `Hardlink/Copy` as the completed file action, keep your download location and root folder on the same filesystem or volume whenever possible. Hardlinks cannot span volumes. If they do not match, Listenarr falls back to copying.

That means:

- Linux and Docker: use bind mounts that point to the same underlying filesystem
- Windows: keep downloads and library on the same drive letter if you want true hardlinks

## Common mistakes

### Using the host path in Docker

If Listenarr runs in Docker, do not enter a host path such as `/mnt/storage/audiobooks` unless that exact path also exists inside the container.

### Using the download folder as the root folder

The root folder should be your final library destination. Your download client should keep using its own incomplete or complete download path.

### Saving a path Listenarr cannot write to

If the path exists but imports fail later, check filesystem permissions for the Listenarr user and verify the mount is read/write.
