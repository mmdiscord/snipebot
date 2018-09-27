const Discord = require("discord.js");
module.exports.run = async (bot, message, args) => {
    //perms
    if(!message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff")) return message.channel.send("There is no ``Snipe Staff`` role in this server!");
    if(!message.member.roles.has(message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff").id)) return message.channel.send("You do not have permission for that command!");
    let embed = new Discord.RichEmbed()
    .setColor("#42f4eb")
    if(require("../functions/startGame.js").gameHost)
        embed.setDescription(require("../functions/startGame.js").countdown == 1 ? "1 Minute" : require("../functions/startGame.js").countdown + " Minutes").setAuthor("Next snipe starting in approximately");
    else embed.setAuthor("No Game Started!");
    message.channel.send(embed).then(msg => {require("../functions/startGame.js").embedsToEdit.push({id: msg.id, channel: message.channel.id, guild: message.guild.id})});
}
module.exports.help = {
    name: "starttime"
}