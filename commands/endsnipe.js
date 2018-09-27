const Discord = require("discord.js");
/*Array.prototype.forEach = async function asyncForEach(callback) {
    for (let index = 0; index < this.length; index++) {
      await callback(this[index], index, this)
    }
  }*/
module.exports.run = async (bot, message, args) => {
    
    if(!message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff")) return message.channel.send("There is no ``Snipe Staff`` role in this server!");
    if(!message.member.roles.has(message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff").id)) return message.channel.send("You do not have permission for that command!");
    
    if(!require("../functions/startGame.js").gameHost) return message.channel.send("There is no game that has been started!");
    let kills = new Discord.Collection();
    let won = new Discord.Collection();
    require("../functions/startGame.js").embedsToEdit.forEach(element => {
        let channel = require("../index.js").bot.guilds.get(element.guild).channels.get(element.channel);
        channel.fetchMessage(element.id).then(msg => {
            let embed = new Discord.RichEmbed()
            .setColor("#42f4eb")
            .setAuthor("Game ended!");
            msg.edit(embed);
        })
    });
    function finished(){
        let topKills = kills.sort((a, b) => b - a ).firstKey(10);
        for(let i = 0; i < topKills.length; i++){
            let element = topKills[i];
            let index = i;
            if(kills.get(element) == kills.get(topKills[index+1]) && won.get(element) == false && won.get(topKills[index+1])){
                let org = topKills[index+1]; 
                topKills[index+1] = element; 
                topKills[index] = org;
            }
    }
        let newkills = new Discord.Collection();
            for(let i = 0; i < topKills.length; i++){
                let element = topKills[i];
                newkills.set(element, kills.get(element));
            }
        let res = newkills.sort((a, b) => b - a).firstKey(10).map((username, index) => "**" + (index+1) + ".** " + username + " - **" + newkills.sort((a, b) => b - a).array()[index] + " kills**, " + (won.get(username) == true ? "**Did Win**" : "**Did not Win**")).join("\n");
        let ch = message.guild.channels.find(c => c.name.toLowerCase() == "lastgame");
        ch.bulkDelete(5).catch(err => {});
        let embed = new Discord.RichEmbed()
        .setAuthor("Last Game Leaderboard")
        .setDescription(res)
        .setTimestamp()
        .setColor("#42f4eb");
        ch.send(embed);
        
        delete require("../functions/startGame.js").countdown;
        delete require("../functions/startGame.js").gameHost;
        require("../functions/startGame.js").embedsToEdit = [];
        require("../functions/startGame.js").gameStarted = false;
        require("../functions/startGame.js").channelLocked = true;
        require("../index.js").usersEntered.splice(0);
        require("../index.js").usersEnteredStats.splice(0);
        require("./last3.js").embedsToEdit.splice(0);
        message.guild.channels.find(ch => ch.name == "last3").bulkDelete(100).catch(err => {});
        message.guild.channels.find(ch => ch.name == "last3").bulkDelete(100).catch(err => {});
        message.channel.send(":white_check_mark: Snipe ended!");
}   
    if(require("../index.js").usersEnteredStats.length == 0) finished();
    let users = [];
    for(let x = 0; x < require("../index.js").usersEnteredStats.length; x++){
        let element = require("../index.js").usersEnteredStats[x];
        let file = require("../users/" + element.username + ".json");
        require("http").get({
            hostname: "api.fortnitetracker.com",
            path: "/v1/profile/" + file.platform + "/" + element.username,
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
                    let matchesNow;
                    let winsNow;
                    let killsNow;
                    for(let i = 0; i < res.lifeTimeStats.length; i++){
                        let element1 = res.lifeTimeStats[i];
                        if(element1.key == "Wins") winsNow = parseInt(element1.value);
                        if(element1.key == "Matches Played") matchesNow = parseInt(element1.value);
                        if(element1.key == "Kills") killsNow = parseInt(element1.value);
                    }
                    let matchesPrev;
                    let winsPrev;
                    let killsPrev;
                    for(let i = 0; i < element.stats.lifeTimeStats.length; i++){
                        let element1 = element.stats.lifeTimeStats[i];
                        if(element1.key == "Wins") winsPrev = parseInt(element1.value);
                        if(element1.key == "Matches Played") matchesPrev = parseInt(element1.value);
                        if(element1.key == "Kills") killsPrev = parseInt(element1.value);
                    }
                    let killAmt = killsNow -= killsPrev;
                    users.push({
                        username: element.username,
                        played: (matchesNow !== matchesPrev),
                        won: (winsPrev !== winsNow),
                        kills: killAmt
                    })
                    file.games.push({
                        username: element.username,
                        played: (matchesNow !== matchesPrev),
                        won: (winsPrev !== winsNow),
                        kills: killAmt
                    })
                    require("fs").writeFile("./users/" + element.username + ".json", JSON.stringify(file), function(err){if(err) console.log(err)});
                    if(matchesNow !== matchesPrev){
                        kills.set(element.username, killAmt);
                        won.set(element.username, winsPrev !== winsNow);
                    }
                    if((x+1) == require("../index.js").usersEnteredStats.length) finished();
                    
        })
    });
}
}
module.exports.help = {
    name: "endsnipe"
}