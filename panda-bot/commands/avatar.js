const Discord = require("discord.js");
let botconfig = require("../botconfig");
module.exports.run = async (bot, message, args) => {
	let msg = await message.channel.send("Foto genereren...");
	let target = message.mentions.users.first() || message.author;
	await message.channel.send({
		files: [{
			attachment: target.displayAvatarURL,
			name: "avatar.png"
		}]
	});
	msg.delete();
}
module.exports.help = {
	name: "pf"
}