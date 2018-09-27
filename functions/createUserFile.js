module.exports = function create(user, platform, name){
    const fs = require("fs");
    let obj = {
        "userTag": user.tag,
        "userID": user.id,
        "platform": platform,
        "games": []
    }
    fs.writeFile("./users/" + name + ".json", JSON.stringify(obj), function(err){if(err)console.log(err)});
}