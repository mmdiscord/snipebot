Array.prototype.lastEntry = function(number){
    let res = this.slice(this.length-number);
    return res;
}
const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    let found;
    let foundUsername;
    let foundBool;
    require("fs").readdir("./users", function(err, files){
        files.forEach(file => {
            let username = file.split(".")[0];
            if(require("../users/" + file).userID == message.author.id) {found = require("../users/" + file); foundUsername = username; foundBool = true;}
        })
        if(!foundBool) return message.channel.send("You are not verified! Use ``!link (platform) (username)`` to verify!");
        if(args[0] && !parseInt(args[0])) return message.channel.send("That is not an integer!");
        if(found.games.length < parseInt((args[0]||1))) return message.channel.send(found.length == 0 ? "You have not played any games yet!" : "You have not participated in that many games! You have only participated in ``" + found.games.length + "`` games!");
        let amount = parseInt((args[0] ? args[0] : 1));
        let games = found.games.lastEntry(amount);
        let embed = new Discord.RichEmbed()
        .setAuthor("Last " + (amount == 1 ? "game for " + foundUsername : amount + " games for " + foundUsername + " (Least Recent to Most Recent)"))
        .setColor("#42f4eb")
        .setTimestamp()
        .setDescription(amount == 1 ? "**" + games[0].kills + "** kills **Won:** " + games[0].won + " **Played:** " + games[0].played : games.map((res, index) => "**" + (index+1) + ".** **" + res.kills + "** kills **Won:** " + res.won + " **Played:** " + res.played));
        message.channel.send(embed);
    })
}
module.exports.help = {
    name: "scrimstats"
}