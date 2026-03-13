---
sidebar_position: 5
---

# Notifications

Listenarr can send event notifications to multiple webhook-based services.

Open `Settings -> Notifications` to add them.

## Supported services

Listenarr currently supports:

- `Slack`
- `Discord`
- `Telegram`
- `Pushover`
- `Pushbullet`
- `NTFY`
- `Zapier / Generic`

## Global notifications toggle

Before relying on webhooks, also enable:

- `Settings -> General Settings -> Features -> Enable Notifications`

That toggle controls whether Listenarr should emit notifications at all.

## Notification triggers

Each webhook can subscribe to one or more triggers:

- `Book Added`
- `Download Started`
- `Download Complete`
- `Processing Complete`

In the underlying config these map to:

- `book-added`
- `book-downloading`
- `book-available`
- `book-completed`

## Add a webhook

Every webhook starts with:

- `Name`
- `Type`
- `Enable`
- one or more triggers

The remaining fields depend on the service type.

## Service-specific setup

### Slack

Field used:

- `Webhook URL`

Get it from Slack Incoming Webhooks.

### Discord

Field used:

- `Webhook URL`

Create one in Discord under `Server Settings -> Integrations -> Webhooks`.

### Telegram

Fields used:

- `Bot Token`
- `Chat ID (optional)`

Create the bot with `@BotFather`. You can either:

- enter the bot token and optional chat ID in Listenarr
- or provide the full Telegram webhook URL directly

If you set a chat ID, Listenarr includes it when composing the final request.

### Pushover

Fields used:

- `Pushover User Key`
- `Pushover API Token`

Listenarr builds the final request URL for you when you save.

### Pushbullet

Field used:

- `Pushbullet Access Token`

Get it from `Settings -> Account -> Access Tokens` in Pushbullet.

### NTFY

Field used:

- `Webhook URL`

Use either:

- `https://ntfy.sh/<topic>`
- your self-hosted NTFY instance URL

### Zapier / Generic

Field used:

- `Webhook URL`

This is the catch-all option for any service that accepts normal webhook POSTs.

## Test notifications

Each saved webhook includes a `Test` action. Use it after saving.

If a webhook test fails:

- verify the service-specific credential or token
- make sure the URL is HTTPS where required
- confirm the receiving service still accepts the webhook
- check whether the webhook itself is enabled

## Enable and disable without deleting

Every webhook has its own on/off toggle. That lets you pause a destination without removing its config.

Use disable when:

- a service is temporarily noisy
- you are migrating to a new webhook
- you want to keep the config for later

## Recommended pattern

A good starting setup is:

- one Discord or Slack webhook for general status
- one mobile-friendly service such as Telegram, Pushover, or Pushbullet for completion alerts

Keep the trigger set small at first. `Download Complete` and `Processing Complete` are usually the most useful signals.
