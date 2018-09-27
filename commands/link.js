module.exports.run = async (bot, message, args) => {
    if(!args[0] || !args[1]) return message.channel.send("Invalid format! ``!link (platform) (name)``");
    if(args[0].includes(".")) return message.channel.send("Your name cannot include ``.``");
    if(require("fs").existsSync("./users/" + args[1] + ".json")) return message.channel.send("That username has already been linked to the account ``" + (JSON.parse(require("fs").readFileSync("./users/" + args[1] + ".json")).userTag) + "``!");
    require("../functions/createUserFile.js")(message.author, args[0], args[1]);
    message.channel.send(":white_check_mark: User ``" + message.author.tag + "`` has been linked to the account ``" + args[1] + "`` on platform ``" + args[0] + "``!");
}
module.exports.help = {
    name: "link"
}