const Discord = require('discord.js');
const jsonfile = require('jsonfile');

const bot = new Discord.Client();

// The minimum allowable time between saves (milliseconds)
const minumumSaveInterval = 10000;
// Whether or not the whitelist is saved
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
    console.log("Whitelist file saved.")
    saved = true;
}

//Calls when the bot first comes online
bot.on('ready',function(){
    console.log('Bot is online.');
    
    // Variable setup.
    var previousAction = ''
    var objectAdded = {}
    
    bot.user.setActivity('with your server.', {type:'messing'})
})

bot.on('message', message=>{
    let args = message.content.substring(prefix.length).split(" ");
    let moveRole = message.guild.roles.find(x => x.name == 'move')

    // 0 is base command -- !ping help -- (ping in this case)
    switch(args[0]){
        // --- DO COMMANDS ---
        case 'ping':
            message.channel.send("pong!");
            break;

        case 'website':
            message.channel.send("https://github.com/JacobStenson1/GameRoles")
            break;

        case 'add':
            var hasPerms = message.member.roles.has(moveRole.id)
            if (hasPerms){
                var roleToAdd = args.pop()
                var gameNameAdd = args.slice(1,args.length).join(" ")
                if ((!gameNameAdd) && (!roleToAdd)){
                    message.reply("Please enter the correct command (/add [gameName] [role name]")
                }else{
                    // Apply changes
                    whiteListedApps[gameNameAdd] = roleToAdd;
                    //var gameJustAdded = gameName
                    console.log("Added game: "+gameNameAdd+" with role name: "+roleToAdd)
                    message.reply("Added game: "+gameNameAdd+" with role name: "+roleToAdd)
                    objectAdded = {'Game' : gameNameAdd, 'Role' :roleToAdd}
                    previousAction = 'add'
                    // Save
                    scheduleSave();
                }
            }else{
                message.reply("You do not have sufficient permissions to perform that command.")
            }
            break;

        case 'addmygame':
            var hasPerms = message.member.roles.has(moveRole.id)
            if (!args[1]){
                message.reply("Please provide a role name.")
                break;
            }
            if (hasPerms){
                var roleToAdd = args.pop()
                // Get the game the user is playing
                gameNameAdd = message.member.presence.game.toString();

                if ((!gameNameAdd) && (!roleToAdd)){
                    message.reply("Please enter the correct command (/add [gameName] [role name]")
                }else{
                    // Apply changes
                    whiteListedApps[gameNameAdd] = roleToAdd;
                    //var gameJustAdded = gameName
                    console.log("Added game: "+gameNameAdd+" with role name: "+roleToAdd)
                    message.reply("Added game: "+gameNameAdd+" with role name: "+roleToAdd)
                    objectAdded = {'Game' : gameNameAdd, 'Role' :roleToAdd}
                    previousAction = 'add'
                    // Save
                    scheduleSave();
                }
            }else{
                message.reply("You do not have sufficient permissions to perform that command.")
            }
            break;

        case 'delete':
            var hasPerms = message.member.roles.has(moveRole.id)
            if (hasPerms){
                var roleToDelete = args.pop()
                var gameNameDelete = args.slice(1,args.length).join(" ")
                delete whiteListedApps[gameNameDelete]
                console.log("The "+gameNameDelete+" game and "+roleToDelete+" role, has been deleted from the whitelist.")
                message.reply("The "+gameNameDelete+" game and "+roleToDelete+" role, has been deleted from the whitelist.")
                // Save
                scheduleSave();
                previousAction = 'delete'
            }else{
                message.reply("You do not have sufficient permissions to perform that command.")
            }
            break;

        case 'undo':
            var hasPerms = message.member.roles.has(moveRole.id)
            if (hasPerms){
                // If the file is saved...
                if (saved){
                    if (previousAction == 'add'){
                        // Delete the game that has just been added.
                        delete whiteListedApps[objectAdded['Game']]
                        message.reply(objectAdded['Game'] +": "+objectAdded['Role']+" - has been deleted.")
                        scheduleSave()
        
                    }else if (previousAction == 'delete'){
                        console.log("placeholder, deleted...")
                        //roleToDelete
                        //gameNameDelete
                        message.reply("Sorry, undoing a delete is not implemented yet.")
                    }else{
                        console.log("Issue.")
                        message.reply("Undo is not implemented yet.")
                    }
                }else{
                    message.reply("Please wait for the whitelist file to be saved.")
                }
            }else{
                message.reply("You do not have sufficient permissions to perform that command.")
            }
            break;
            
        case 'games':
            var hasPerms = message.member.roles.has(moveRole.id)
            if (hasPerms){
                var stringToSend = "-- Here is the whitelist of games (game : role) -- \n"
                var whiteListedAppsLength = Object.keys(whiteListedApps).length

                for (i = 0; i < whiteListedAppsLength; i++) {
                    var key = Object.keys(whiteListedApps)[i]
                    var value = whiteListedApps[key]
                    var keyValueGames = (key +" : "+value)
                    stringToSend += (keyValueGames + "\n")
                }
                message.channel.send(stringToSend)
            }else{
                message.reply("You do not have sufficient permissions to perform that command.")
            }
            break;

        case 'info':
            message.channel.send("The author of this bot is Salazhar. See the GitHub for this bot here: https://github.com/JacobStenson1/GameRoles")
            break;

        // --- DO COMMANDS ---
        case 'help':
            var helpWith = args.pop()
            var messageContent
            switch(helpWith){
                case 'website':
                    messageContent = '```\n/website \nThis command will display a link to the GitHub repository for this bot.```'
                    break;
                case 'add':
                    messageContent = '```\n/add \nThis command allows you to add a game to the bots whitelist.\nUse in the form /add [gamename] [role name].\nIf the bot cannot find the role in your server, it will add it automatically.```'
                    break;
                case 'addmygame':
                    messageContent = '```\n/addmygame \nThis command will pull the game you are playing and add the game to the whitelist.\nUse in the form /addmygame [role name].\nIf the bot cannot find the role in your server, it will add it automatically.```'
                    break;
                case 'delete':
                    messageContent = '```\n/delete \nThis command will display a link to the GitHub repository for this bot.```'
                    break;
                case 'undo':
                    messageContent = '```\n/undo \nThis command will display a link to the GitHub repository for this bot.```'
                    break;
                case 'games':
                    messageContent = '```\n/games \nThis command will display a link to the GitHub repository for this bot.```'
                    break;
            }
            message.channel.send(messageContent)
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
        //console.log(newMember.displayName+" : "+ memberGameString)

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