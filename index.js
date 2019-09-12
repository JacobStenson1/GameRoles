const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'NjIwMDMzNTEyNTE4NDUxMjEx.XXQ5Qw.aR9KWtif5gmx-E-6RdSmmintrcM';

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
            console.log(args[1])
            console.log(args[2])
            serverRoles[args[1]] = args[2]

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
        case '':
            message.reply("Please enter a command (ping, website, info).");
    }
})

bot.on('presenceUpdate', (oldMember,newMember) => {
	if(oldMember.presence.game!==newMember.presence.game){ // If the user's activity (can be a game but also spotify) changes.
        console.log("Someones presence changed.");
        console.log("oldMember presence var: "+oldMember.presence.game);
        console.log("newMember presence var: "+newMember.presence.game);

        if(newMember.presence.game != null){
            var roleString = serverRoles[newMember.presence.game.toString()];

            let roleToAdd = newMember.guild.roles.find(role => role.name === roleString);
            newMember.addRole(roleToAdd);
        }
        
        
	}
});


bot.login(token);