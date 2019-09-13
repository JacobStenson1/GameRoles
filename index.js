const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');

var tokenText = fs.readFileSync('./TokenFile.txt');
const token = tokenText.toString();
const prefix = '/';


var whiteListedApps = {
    'League of Legends': 'league',
    'Grand Theft Auto V' : 'gta',
    'Quake Champions' : 'quake',
    'Quake Live™':'quake',
    //:'',
    //'':'',
    //'':'',
    //'////':'',
    //'':'',

}


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
            //console.log(args[1])
            //console.log(args[2])
            //serverRoles[args[1]] = args[2]
            //console.log(serverRoles)
            break;

        case 'info':
            if(args[1] === 'author'){
                message.channel.send("The author of this bot is Salazhar.")
            }
            else if(args[1] === 'test'){
                message.channel.send("test. Yeah, thats all test does.");
            }
            else{
                message.channel.send("Available info commands: author, test.")
            }
            break;
    }
})

bot.on('presenceUpdate', async (oldMember,newMember) => {
    if(oldMember.presence.game !== newMember.presence.game){ // If the user's activity changes.

        if(newMember.presence.game != null){
            console.log("-- Someone's presence was updated. --")
            memberGameString = newMember.presence.game.toString();

            console.log(newMember.displayName+": "+memberGameString);
    
            // Do nothing if the user is using one of the blacklisted applications.
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

                // Find the role by the name
                var roleToAdd = role
                newMember.addRole(roleToAdd);
                console.log("Gave "+newMember.displayName+" the "+roleToAdd.name+" role.")
            }
            else{
                console.log(newMember.displayName+"'s Application is not whitelisted. ("+memberGameString+").")
            }
        }
        
	}
});


bot.login(token);