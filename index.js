const Discord = require('discord.js');
const bot = new Discord.Client();

var tokenFile = require('./TokenFile.json');
const prefix = '/';

var whiteListedApps = require("./whitelist.json");

//Calls when the bot first comes online
bot.on('ready',function(){
    console.log('Bot is online.');
    bot.user.setActivity('with your server.', {type:'messing'})
})

bot.on('message', message=>{
    let args = message.content.substring(prefix.length).split("_");

    // 0 is base command -- !ping help -- (ping in this case)
    switch(args[0]){
        case 'ping':
            message.channel.send("pong!");
            break;
        case 'website':
            message.channel.send("google.com")
            break;
        case 'add':
            whiteListedApps[args[1]] = args[2];
            console.log("Added game: "+args[1]+" with role name: "+args[2])
            message.reply("Added game: "+args[1]+" with role name: "+args[2])
            break;
        case 'info':
            message.channel.send("The author of this bot is Salazhar. See the github for this bot here: https://github.com/JacobStenson1/DiscordGameRoleBot")
            break;
    }
})

bot.on('presenceUpdate', async (oldMember,newMember) => {
    // If the game has changed...
    if(oldMember.presence.game !== newMember.presence.game){
        botsRole = newMember.guild.roles.find(x => x.name == 'bots')
        hasBotsRole = newMember.roles.has(botsRole.id)

        // If the presence is nothing, return. Or if the member has the bot role.
        if((newMember.presence.game == null) || (hasBotsRole) || (newMember.presence.game == 'Spotify')){
            return;
        }
        
        var memberGameString = newMember.presence.game.toString();
        console.log(newMember.displayName+" : "+ memberGameString)

        // See if the application the user is running is whitelisted.
        if(memberGameString in whiteListedApps){
            // Set roleName equal to the abreviated game name.
            var roleName = whiteListedApps[memberGameString];
            var role = newMember.guild.roles.find(x => x.name == roleName);
            // Search could not find the role by the specific game name (game name could be abreviated).
            if(!role) {
                console.log("that role does not exist, creating it.")
                // Waits till the role is created, then carries on.
                await newMember.guild.createRole({name:roleName, mentionable:true})                
            }
            var roleToAdd = newMember.guild.roles.find(x => x.name == roleName);

            // Does the person have the role already?
            hasRole = newMember.roles.has(roleToAdd.id)
            if(!hasRole){
                // If they dont have the role...
                newMember.addRole(roleToAdd);
                console.log("Gave "+newMember.displayName+" the "+roleToAdd.name+" role.")
            }
        }
    }
});

bot.login(tokenFile.token);