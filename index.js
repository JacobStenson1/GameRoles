const Discord = require('discord.js');
const jsonfile = require('jsonfile');

const bot = new Discord.Client();

// The minimum allowable time between saves (milliseconds)
const minumumSaveInterval = 10000;
// Whether or not the whitlist is saved
var saved = true;

var tokenFile = require('./TokenFile.json');
const prefix = '/';

var whiteListedApps = require("./whitelist.json");

/**
 * Limits how often saves can happen to avoid abuse
 */
function scheduleSave(){
    if(saved){
        setTimeout(save, minumumSaveInterval);
        saved = false;
    }
}
/**
 * Saves the whitelist
 */
function save(){
    jsonfile.writeFile("./whitelist.json", whiteListedApps, { spaces: 2, EOL: '\r\n' }, function(err){
        if (err) throw(err);
    })
    saved = true;
}

//Calls when the bot first comes online
bot.on('ready',function(){
    console.log('Bot is online.');
    bot.user.setActivity('with your server.', {type:'messing'})
})

bot.on('message', message=>{
    let args = message.content.substring(prefix.length).split(" ");

    // 0 is base command -- !ping help -- (ping in this case)
    switch(args[0]){
        case 'ping':
            message.channel.send("pong!");
            break;
        case 'website':
            message.channel.send("google.com")
            break;
        case 'add':
            var roleToAdd = args.pop()
            var gameName = args.slice(1,args.length).join(" ")
            if ((!gameName) && (!roleToAdd)){
                message.reply("Please enter the correct command (/add [gameName] [role name]")
            }else{
                // Apply changes
                whiteListedApps[gameName] = roleToAdd;
                console.log("Added game: "+gameName+" with role name: "+roleToAdd)
                message.reply("Added game: "+gameName+" with role name: "+roleToAdd)
                // Save
                scheduleSave();
            }
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
        
        hasBotsRole = false;

        // If found the bot role on the member (indicating they are a bot)
        if (botsRole){
            hasBotsRole = newMember.roles.has(botsRole.id)
        }

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