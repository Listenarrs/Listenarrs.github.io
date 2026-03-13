---
sidebar_position: 6
---

# Discord bot

Listenarr includes a built-in Discord request bot workflow so users can request audiobooks from Discord with slash commands.

Open `Settings -> Discord Bot` to configure it.

## Prerequisites

Before you enable the bot, make sure you have:

- a Discord application and bot token from the Discord Developer Portal
- a public URL for your Listenarr instance
- Node.js 20+ available for non-Docker installs if your deployment needs the helper runtime

For Docker deployments, set:

```bash
LISTENARR_PUBLIC_URL=https://your-domain.com
```

That URL is important for public or reverse-proxied deployments and is the first URL the bot integration tries to use.

## Create the Discord application

1. Go to `https://discord.com/developers/applications`.
2. Create a new application.
3. Add a bot user to the application.
4. Copy the `Application ID`.
5. Copy the `Bot Token`.

## Configure the Listenarr fields

### Enable Discord Bot Integration

Turn this on first so Listenarr knows these settings should be used.

### Discord Application ID

The application or client ID from Discord. Listenarr uses this to generate the invite URL and register slash commands.

### Discord Guild ID (optional)

Use this for testing in one server. Guild-scoped command registration updates faster than global registration.

### Discord Channel ID (optional)

If set, the bot only accepts requests from that channel. This is useful when you want to keep requests limited to one place.

### Bot Token

The bot token from the Discord developer portal. Keep it secret.

### Command Group Name

Default: `request`

This is the main slash command group.

### Subcommand Name

Default: `audiobook`

With the default values, your command becomes:

```text
/request audiobook <title>
```

### Bot Username (optional)

Custom display name for the bot.

### Bot Avatar URL (optional)

Optional avatar image URL for the bot.

## Invite the bot

Once the Application ID is filled in, Listenarr can:

- open the invite URL
- copy the invite URL
- check whether the bot is installed

Use the generated invite controls from the settings page rather than manually building the OAuth URL unless you specifically need custom permissions.

## Register commands

After the token and application ID are saved, use:

- `Register commands now`

Do this any time you change:

- the command group name
- the subcommand name
- the guild restriction

## Bot process control

The settings page also exposes process controls:

- `Refresh Status`
- `Start Bot`
- `Stop Bot`

Use them to confirm whether the bot process is actually running after configuration.

## Recommended setup flow

1. Set `LISTENARR_PUBLIC_URL`.
2. Save the Application ID and Bot Token.
3. Optionally save a Guild ID for faster testing.
4. Invite the bot to your server.
5. Register commands.
6. Start the bot.
7. Test a request from Discord.

## Troubleshooting

### Commands are not showing up

- verify the Application ID and Bot Token
- register commands again
- if you are testing, set a Guild ID and re-register

### Bot starts but cannot respond correctly

- verify `LISTENARR_PUBLIC_URL`
- make sure the Listenarr instance is reachable from where the bot is running
- check whether the bot is restricted to a specific channel

### Docker users

If the bot cannot talk back to Listenarr, confirm the container has the correct `LISTENARR_PUBLIC_URL` and that the URL resolves externally the same way your users reach the site.
