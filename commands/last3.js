const Discord = require("discord.js");
let embedsToEdit = [];
module.exports.run = async (bot, message, args) => {
    if(!message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff")) return message.channel.send("There is no ``Snipe Staff`` role in this server!");
    if(!message.member.roles.has(message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff").id)) return message.channel.send("You do not have permission for that command!");

    if(!require("../index.js").usersEntered || require("../index.js").usersEntered.length == 0) return message.channel.send("There is no game that has been started!");
    let embed = new Discord.RichEmbed()
    .setAuthor("Last 3 Leaderboard")
    .setColor("#42f4eb");
    require("../functions/startGame.js").codes.forEach(element => {
        embed.addField(element.code + " - " + (element.players.length == 1 ? "1 Player" : element.players.length + " Players"), "" + element.players.join("\n"), true);
    })
    message.channel.send(embed).then(msg => {embedsToEdit.push({id: msg.id, channel: msg.channel.id, guild: msg.guild.id});module.exports.embedsToEdit=embedsToEdit;});

}
module.exports.help = {
    name: "last3"
}
module.exports.embedsToEdit = [];