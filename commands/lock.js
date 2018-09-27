module.exports.run = async (bot, message, args) => {
    if(!message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff")) return message.channel.send("There is no ``Snipe Staff`` role in this server!");
    if(!message.member.roles.has(message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff").id)) return message.channel.send("You do not have permission for that command!");

    require("../functions/startGame.js").channelLocked = true;
    message.channel.send(":white_check_mark: Channel locked for the rest of this snipe");
}
module.exports.help = {
    name: "lock"
}