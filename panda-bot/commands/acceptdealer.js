const Discord = require("discord.js");
let botconfig = require("../botconfig");
const agree = "✅";
let cyan = botconfig.cyan;
module.exports.run = async (bot, message, args) => {
	let author = message.author.username;
	let dealer = (args[0]);
	if (!args[0]) return message.reply(" Je hebt geen dealer opgegeven.");
	let badges = (args.slice(1).join(" "));
	let embed = new Discord.RichEmbed().setAuthor(message.author.username + " heeft een verzoek ingediend om een dealer te accepteren.").setColor(cyan).addField("Het gaat om", dealer).addField("De dealer moet geaccepteerd worden in", badges).setFooter("Heb jij deze persoon aangenomen? zet de ✅ dan op 2!");
	let kanaal = message.guild.channels.find("name", "dealer-status");
	if (!kanaal) return message.reply(" Ik kan het kanaal:" + " dealer-status " + "niet vinden.");
	message.delete().catch(O_o => {});
	message.reply(" Je hebt aangegeven dat " + dealer + " geaccepteerd moet worden in " + badges + ". Bekijk de status in " + kanaal);
	let msg = await kanaal.send(embed);
	await msg.react(agree);
}
module.exports.help = {
	name: "accepteer"
}