const Discord = require('discord.js');
const bot = new Discord.Client();

const token = '';

const prefix = '/';

var serverRoles = {
    'Grand Theft Auto V': 'gta'
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
            console.log(args[1])
            console.log(args[2])
            serverRoles[args[1]] = args[2]

            console.log(serverRoles)

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

bot.on('presenceUpdate', (oldMember,newMember) => {
	if(oldMember.presence.game!==newMember.presence.game){ // If the user's activity (can be a game but also spotify) changes.
        console.log("Someones presence changed.");
        //console.log("oldMember "+oldMember.displayName+": "+oldMember.presence.game);
        console.log("newMember "+newMember.displayName+": "+newMember.presence.game);

        if(newMember.presence.game != null){
            console.log("The user is doing something");
            newMemberGameString = newMember.presence.game.toString();

            if(newMemberGameString != 'Spotify'){
                console.log("They are not playing spotify");
                var dictSearch = newMemberGameString

                // If the game the person is playing is in the dictionary (This means that the name of the game is different to the role name)
                if(dictSearch in serverRoles){
                    // Search for the role name by the game name in the serverRoles dictionary
                    var roleString = serverRoles[newMemberGameString];
                    // Get the role to add to the member by searching the server for it by the name.
                    var roleToAdd = newMember.guild.roles.find(role => role.name === roleString)
                    console.log("test1")
                }else{
                    // Get the role name by the game name.
                    var roleToAdd = newMember.guild.roles.find(role => role.name === newMemberGameString);
                }

                // Give the member the role.
                console.log("Gave "+newMember.name+" the "+roleToAdd.name+" role.")
                newMember.addRole(roleToAdd);
            }
        }
	}
});


bot.login(token);