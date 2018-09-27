module.exports.run = async (bot, message, args) => {
    if(!message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff")) return message.channel.send("There is no ``Snipe Staff`` role in this server!");
    if(!message.member.roles.has(message.guild.roles.find(r => r.name.toLowerCase() == "snipe staff").id)) return message.channel.send("You do not have permission for that command!");
    if(!args[0]) return message.channel.send("Please provide an amount of time in minutes!");
    if(!args[1]) return message.channel.send("Please provide a host!");
    if(require("../functions/startGame.js").gameHost) return message.channel.send("There is already a snipe started! Use ``!endsnipe`` to end the snipe!")
    require("../functions/startGame.js").start(args[1], args[0], args.slice(2).join(" ") || "Go to this voice channel, a Snipe Staff will count down 3, 2, 1, and then type your last 3 digits in #last3!");
    message.channel.send(":white_check_mark: Snipe started!");
}
module.exports.help = {
    name: "startsnipe"
}