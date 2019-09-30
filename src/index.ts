import * as Discord from 'discord.js';
import {PREFIX, TOKEN, whiteListedApps} from './constants';

const bot = new Discord.Client();

bot.on('message', async (message: Discord.Message) => {
    let args = message.content.substring(PREFIX.length)
        .split("_");

    // 0 is base command -- !ping help -- (ping in this case)
    switch (args[0]) {
        case 'ping':
            await message.channel.send("pong!");
            break;
        case 'website':
            await message.channel.send("google.com");
            break;
        case 'add':
            whiteListedApps.set(args[1], args[2]);
            console.log(`Added game: ${args[1]} with role name: ${args[2]}`);
            await message.reply(`Added game: ${args[1]} with role name: ${args[2]}`);
            break;
        case 'info':
            await message.channel.send("The author of this bot is Salazhar. See the github for this bot here: "
                + "https://github.com/JacobStenson1/DiscordGameRoleBot");
            break;
    }
});

bot.on('presenceUpdate', async (oldMember: Discord.GuildMember, newMember: Discord.GuildMember) => {
    if (oldMember.user.bot) return;
    // If the game has changed...
    if (oldMember.presence.game !== newMember.presence.game) {
        // If the presence is nothing, return. Or if the member has the bot role.
        if (newMember.presence.game == null) return;
        let memberGameString: string = newMember.presence.game.toString();
        console.log(`${newMember.displayName}: "${memberGameString}"`);

        // See if the application the user is running is whitelisted.
        if (whiteListedApps.has(memberGameString)) {
            console.log("-- Someone's presence was updated. --");
            console.log(`${newMember.displayName}: ${memberGameString}`);

            let abbreviated: string | undefined = whiteListedApps.get(memberGameString);
            let role: Discord.Role | undefined = newMember.guild.roles.find((x: Discord.Role) => x.name == abbreviated);

            // Search could not find the role by the specific game name (game name could be abbreviated).
            if (role == undefined) {
                console.log("that role does not exist, creating it.");
                // Waits till the role is created, then carries on.
                await newMember.guild.createRole({name: abbreviated, mentionable: true})
                    .then(async (role: Discord.Role) => {
                        await newMember.addRole(role);
                        console.log(`Gave ${newMember.displayName} the ${role.name} role.`);
                    });
            } else if (role && newMember.roles.has(role.id)) console.log(`${newMember.displayName} already has the role.`);
            else {
                await newMember.addRole(role);
                console.log(`Gave ${newMember.displayName} the ${role.name} role.`);
            }
        } else console.log(`${newMember.displayName}'s Application is not whitelisted. (${memberGameString}).`);
    }
});

bot.login(TOKEN)
    .then(async () => {
        console.log('Bot is online.');
        await bot.user.setActivity('with your server.', {type: "PLAYING"});
    });
