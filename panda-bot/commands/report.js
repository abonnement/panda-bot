const Discord = require("discord.js");
let botconfig = require("../botconfig");
let cyan = botconfig.cyan;
module.exports.run = async (bot, message, args) => {
	let aanmaker = message.author.username;
	let persoon = (args[0]);
	if (!args[0]) return message.reply("Je hebt geen persoon opgegeven.");
	let reden = (args.slice(1).join(" "));
	let embed = new Discord.RichEmbed().setAuthor(message.author.username + " heeft iemand afwezig gemeld.").setColor(cyan).addField("Het gaat om", "__**" + persoon + "**__").setFooter(reden);
	let kanaal = message.guild.channels.find("name", "afwezigheid");
	if (!kanaal) return message.reply("Ik kan het kanaal:" + " afwezigheid " + "niet vinden.");
	if (aanmaker == persoon) {
		message.delete().catch(O_o => {});
		message.reply("Je hebt jezelf afwezig gemeld." + "Bekijk de melding in: " + kanaal);
		kanaal.send(embed);
	} else {
		message.delete().catch(O_o => {});
		message.reply("Je hebt " + persoon + " afwezig gemeld." + " Bekijk de melding in: " + kanaal);
		kanaal.send(embed);
	}
}
module.exports.help = {
	name: "meld"
}