const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');

var tokenText = fs.readFileSync('./TokenFile.txt');
const token = tokenText.toString();
const prefix = '/';


var whiteListedApps = {
    "League of Legends": "league",
    "Grand Theft Auto V" : "gta",
    "Quake Champions" : "quake",
    "Quake Live™":"quake",
    "Warframe" : "warframe",
    "Rust" : "rust",
    "Chivalry" : "chivalry",
    "Battlerite" : "battlerite",
    "Insurgency" : "insurgency",
    "For Honor" : "forhonor",
    "Hearts of Iron IV" : "hoi4",
    "STAR WARS Battlefront II" : "battlefront",
    "STAR WARS Battlefront" : "battlefront",
    "PAYDAY: The Heist" : "payday",
    "PAYDAY 2" : "payday",
    "DOOM" : "doom",
    "Forza Horizons 4" : "forza",
    "Terraria" : "terraria",
    "Duck Game" : "duckgame",
    "Apex Legends" : "apex",
    "Hytale" : "hytale",
    "Worms Revolution" : "worms",
    "Worms Armageddon" : "worms",
    "SCP: Secret Laboratory" : "scp",
    "Diablo III" : "diablo",
    "ARK: Survival Evolved" : "ark",
    "Minecraft" : "minecraft",
    "Grand Theft Auto V" : "gta",
    "Grand Theft Auto IV" : "gta",
    "Z1 Battle Royale" : "h1z1",
    "Sid Meier's Civilization V" : "civ",
    "Sid Meier's Civilization VI" : "civ",
    "Call of Duty: Modern Warfare" : "cod",
    "Call of Duty: Modern Warfare 3" : "cod",
    "Call of Duty: Modern Warfare 2" : "cod",
    "Call of Duty: Black Ops" : "cod",
    "Call of Duty: Black Ops II" : "cod",
    "Call of Duty: Black Ops 2" : "cod",
    "Call of Duty: Black Ops III" : "cod",
    "Call of Duty: Black Ops 3" : "cod",
    "Call of Duty: Black Ops 4" : "cod",
    "Call of Duty: Black Ops IIII" : "cod",
    "Battlefield 3" : "battlefield",
    "Battlefield 1" : "battlefield",
    "Battlefield V" : "battlefield",
    "PLAYERUNKNOWN'S BATTLEGROUNDS" : "pubg",
    "Fortnite" : "fortnite",
    "Destiny 2" : "destiny",
    "Counter-Strike: Global Offensive" : "csgo",
    "Runescape" : "runescape",
    "Old School Runescape" : "runescape",
    "SMITE" : "smite",
    "Tom Clancy's Rainbow Six Siege" : "siege",
    "Jurassic World Evolution" : "jwe",
    "Overwatch" : "overwatch",
    "Unturned" : "unturned",
    "The Elder Scrolls Online" : "eso",
    "Rocket League" : "rocketleague",
    "Garry's Mod" : "gmod",
    "Sea of Thieves" : "seaofthieves",
    "No Man's Sky" : "nomanssky",
    "Cities: Skylines" : "cities",

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
            whiteListedApps[args[1]] = args[2];
            console.log("Added game: "+args[1]+" with role name: "+args[2])
            break;
        case 'info':
                message.channel.send("The author of this bot is Salazhar. See the github for this bot here: https://github.com/JacobStenson1/DiscordGameRoleBot")
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
                    // Find the role by the name
                    
                }
                var roleToAdd = newMember.guild.roles.find(x => x.name == roleName);
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