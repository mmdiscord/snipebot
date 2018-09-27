const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    let wins = new Discord.Collection();
    require("fs").readdir("./users", function(err, files){
        files.forEach(f => {
            let file = require("../users/" + f);
            let username = f.split(".")[0];
            let winCount = 0;
            file.games.forEach(element => {
                const won = element.won;
                //if(played){
                    if(won) winCount++;
                //}
            })
            wins.set(username, winCount)
        })
        let embed = new Discord.RichEmbed()
        .setAuthor("Top 10 Wins")
        .setColor("#42f4eb")
        .setTimestamp()
        .setDescription(wins.sort((a, b) => b - a).firstKey(10).map((res, index) => "**" + (index+1) + ".** **" + res + "** - ``" + wins.array()[index] + "``").join("\n"));
        message.channel.send(embed);
    })
}
module.exports.help = {
    name: "topwins"
}