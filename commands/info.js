const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    if(!message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff")) return message.channel.send("There is no ``Snipe Staff`` role in this server!");
    if(!message.member.roles.has(message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff").id)) return message.channel.send("You do not have permission for that command!");
    let embed = new Discord.RichEmbed()
    .setAuthor("Fortnite Snipe Bot Info")
    .setColor("#42f4eb");
    if(!require("../functions/startGame.js").gameStarted) embed.setDescription("No Game currently Started");
    else embed.addField("Host", require("../functions/startGame.js").gameHost).addField("Instructions", require("../functions/startGame.js").instructions).addBlankField();
    message.channel.send(embed);
}
module.exports.help = {
    name: "info"
}