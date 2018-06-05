const Discord = require("discord.js");
let botconfig = require("../botconfig");
module.exports.run = async (bot, message, args) => {
	if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" Je hebt hier geen rechten voor.");
	if (!args[0]) return message.reply(" Dit is geen geldige waarde.");
	if (isNaN(args[0])) return message.reply(" Je moet een getal opgeven.");
	if (args[0] > 100) return message.reply(" Je moet een getal opgeven onder de 100.");
	message.channel.bulkDelete(args[0]).then(() => {
		message.channel.send(`${args[0]} berichten verwijderd.`).then(msg => msg.delete(5000));
	})
}
module.exports.help = {
	name: "delete"
}