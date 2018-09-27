const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
module.exports.bot = bot;
const fs = require("fs");
bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  }); 
});
bot.on('ready', async () => {
    console.log(bot.user.username + " is now ready!");
    bot.user.setActivity("Fortnite Users", {type: "WATCHING"});
})
let usersEntered = [];
module.exports.usersEntered = usersEntered;
let usersEnteredStats = [];
module.exports.usersEnteredStats = usersEnteredStats;
bot.on('message', async (message) => {

//75c1a1f6-f0a1-4f89-9af2-3fe94eb8d7e9
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.channel.name == "last3"){
        if(usersEntered.includes(message.author.id)) return message.delete();
        if(require("./functions/startGame.js").channelLocked) return message.delete();
        let found;
        let foundUsername;
        fs.readdir("./users", (err, files) => {
            files.forEach(file => {
                if(require("./users/" + file).userID == message.author.id) {found = require("./users/" + file); foundUsername = file.split(".")[0];}
            })
            if(!found) return message.delete();
            usersEntered.push(message.author.id);
            require("http").get({
                hostname: "api.fortnitetracker.com",
                path: "/v1/profile/" + found.platform + "/" + foundUsername,
                headers: {
                    'TRN-Api-Key': '75c1a1f6-f0a1-4f89-9af2-3fe94eb8d7e9'
                },
            }, function(response){
                let res = "";
                response.on('data', function (chunk) {
                  res += chunk;
                });
              
                response.on('end', function () {
                    res = JSON.parse(res);
                    usersEnteredStats.push({
                        id: message.author.id,
                        stats: res,
                        username: foundUsername
                    });
                    module.exports.usersEnteredStats = usersEnteredStats;
                    //message.channel.send(foundUsername + "'s stats: \n" + "``K/D`` - " + res.stats.p9.kd.valueDec + "\n" + "``Matches Played``" + res.stats.p9.matches.value + "\n" + "``Kills`` - " + res.stats.p9.kills.value + "\n")
                    let codes = require("./functions/startGame.js").codes;
                    if(codes.includes(message.content)){
                        codes.forEach(element => {
                            if(element.code == message.content)
                                element.players.push(foundUsername);
                        })
                    } else {
                        codes.push({
                            code: message.content,
                            players: [foundUsername]
                        });
                    }
                    module.exports.usersEntered = usersEntered;
                    let embed = new Discord.RichEmbed()
                    .setAuthor("Last 3 Leaderboard")
                    .setColor("#42f4eb");
                    require("./functions/startGame.js").codes.forEach(element => {
                        embed.addField(element.code + " - " + (element.players.length == 1 ? "1 Player" : element.players.length + " Players"), "" + element.players.join("\n"), true);
                    })
                    require("./commands/last3.js").embedsToEdit.forEach(element => {
                        let guild = bot.guilds.get(element.guild);
                        let channel = guild.channels.get(element.channel);
                        channel.fetchMessage(element.id).then(msg => {msg.edit(embed)})
                    })
                });
            })
        })
    }
    let prefix = "!";
    if(!message.content.startsWith(prefix)) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
  
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);
})
bot.login("NDk0NjM2MDY2MzE0MTI1MzIz.Do2aSw.obJ7Q7iiappb-DZ20dR1cjIQgDE"); 