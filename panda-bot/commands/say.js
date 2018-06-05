const Discord = require("discord.js");
let botconfig = require("../botconfig");
module.exports.run = async (bot, message, args) => {
	let bericht = args.join(" ");
	message.delete().catch();
	message.channel.send(bericht);
}
module.exports.help = {
	name: "zeg"
}