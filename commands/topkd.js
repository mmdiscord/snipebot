const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    let kd = new Discord.Collection();
    require("fs").readdir("./users", function(err, files){
        files.forEach(f => {
            let file = require("../users/" + f);
            let username = f.split(".")[0];
            let kds = [];
            file.games.forEach(element => {
                const {
                    played,
                    won,
                    kills
                } = element;
                //if(played){
                    let k = kills;
                    let d = won ? 0 : 1;
                    d++;
                    kds.push(k/d);
                //}
            })
            let sum = 0;
            for(let i = 0; i < kds.length; i++){
                sum += parseFloat(kds[i]);
            }
            let avg = sum/kds.length;
            kd.set(username, avg)
        })
        let embed = new Discord.RichEmbed()
        .setAuthor("Top 10 KDs")
        .setColor("#42f4eb")
        .setTimestamp()
        .setDescription(kd.sort((a, b) => b - a).firstKey(10).map((res, index) => "**" + (index+1) + ".** **" + res + "** - ``" + kd.array()[index] + "``").join("\n"));
        message.channel.send(embed);
    })
}
module.exports.help = {
    name: "topkd"
}