const Discord = require("discord.js");
module.exports.start = function start(host, countdown, instructions){
    module.exports.gameHost = host;
    module.exports.countdown = countdown;
    module.exports.gameStarted = true;
    module.exports.instructions = instructions;
    module.exports.channelLocked = true;
    let intervalID = setInterval(function(){
        if(!require("./startGame.js").gameStarted) return clearInterval(intervalID);
        countdown--;
        module.exports.countdown = countdown;
        if(countdown == 0){
            clearInterval()
            require("./startGame.js").embedsToEdit.forEach(element => {
                module.exports.channelLocked = false;
                let channel = require("../index.js").bot.guilds.get(element.guild).channels.get(element.channel);
                channel.fetchMessage(element.id).then(msg => {
                    let embed = new Discord.RichEmbed()
                    .setColor("#42f4eb")
                    .setAuthor("Game started")
                    msg.edit(embed);
                    return clearInterval(intervalID);
                })
            });
        } else {
            require("./startGame.js").embedsToEdit.forEach(element => {
                let channel = require("../index.js").bot.guilds.get(element.guild).channels.get(element.channel);
                channel.fetchMessage(element.id).then(msg => {
                    let embed = new Discord.RichEmbed()
                    .setColor("#42f4eb")
                    .setAuthor("Next snipe starting in approximately")
                    .setDescription(require("./startGame.js").countdown == 1 ? "1 Minute" : require("../functions/startGame.js").countdown + " Minutes");
                    msg.edit(embed);
                })
            });
        }
    }, 60000)
}
module.exports.embedsToEdit = [];
module.exports.channelLocked = true;
module.exports.codes = [];