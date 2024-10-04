# Amelia Discord Bot
Hi i'm amelia! i'm a cat and i'm here to help you do computers on discord
## Commands

### Utility
- /bonk: Bonks another user.
- /cat: Sends a random cat gif using TenorJS.
- /cleargif: Removes a gif from current user's saved gifs.
- /countdown: Creates a countdown embed with an event name and date.
- /favegifs: Saves or gets your saved gifs (limit 50 per user).
- /help: Sends list of commands and provides a verbose description on request.
- /math: Performs basic arithmetic.
- /randomgif: Sends a random gif based on a given keyword using TenorJS.
- /thread: Creates a thread with a given name.
- /translate: Translate a given phrase into cat.
- /weather: Sends the current weather data for a given location.
### Moderation Tools
- /banuser: Bans a user from the server while sending a message to them about the ban and keeping a log of bans.
- /clearcd: Removes a countdown from the saved countdown list.
- /cleargifmod: Retrieves or removes gifs from a given user's saved gifs.
- /getmoddata: Retrieves logged data for warnings, reports, kicks, and bans.
- /kickuser: Kicks a user from the server while sending a message to them about the kick and keeping a log of kicks.
- /modhelp: Gets list of mod-only commands and provides a verbose description on request.
- /reportuser: Reports another user in the server and sends the report to the moderation team. Reported user is not informed.
- /timeout: Times out a user for a given duration.
- /warnuser: Sends a user a warning message and keeps a tally/log of warnings.
### Utility (Genshin Impact)
- /genshin: Gets time of next GI patch.
- /genshinmats: Gets talent materials that can be farmed today or talent materials for a given character.
- /randomgenshin: Randomly chooses a world boss, trounce domain, team of four characters, element, and weapon type.

## Requirements
### Packages/Dependencies
- [Node](https://nodejs.org/en) - Version 18 or higher
- [NPM](https://www.npmjs.com/)
- [DiscordJS](https://discordjs.guide/)
- [TenorJS](https://www.npmjs.com/package/tenorjs)
- [MathJS](https://www.npmjs.com/package/mathjs)

### Bot Permissions/Intents
- Guild Messages
- Message Content
- Guilds
- Direct Messages
- Guild Members

## Config Files
i need a few config files to work
#### config.json
```
{
  "token": "YOUR_BOT_TOKEN_HERE",
  "clientId": "YOUR_DEVELOPER_CLIENT_ID_HERE",
  "guildId": "YOUR_SERVER_ID"
}
```
#### commands/utility/resources/apikeys.json
```
{
  "weatherAPIKey": "YOUR_OPEN_WEATHER_API_KEY_HERE",
  "tenorAPIKey": "YOUR_TENOR_API_KEY_HERE"
}
```
#### commands/utility/resources/roleids.json
You can add as many roles and corresponding ids as you need, current requires "mod" and "admin" role ids
```
{
  "rolename": "YOUR_ROLE_ID_HERE"
}
```

## How To Run
```bash
node deploy-commands.js
node index.js
```

## Customization
Some suggestions to make me the best fit for your server!
- If there are any commands you don't want to include, simply delete the corresponding .js file before deploying the commands.
- Some commands are restricted by role ID (ban, clearcd, cleargifmod, getmoddata, kick, modhelp, timeout, warn). If you wish to control restrictions through Discord Integrations instead, you can remove the role checks in these files.
- The /bonk command creates an embed with a bonking gif. You can change this to whatever you wish by changing the bonkgif variable.