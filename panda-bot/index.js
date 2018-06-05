const botconfig = require("./botconfig.json");

const Discord = require("discord.js");

const fs = require("fs");

const didYouMean = require('didyoumean');

const request = require("request");

const warns = JSON.parse(fs.readFileSync("warnings.json", "utf8"));

const pot = JSON.parse(fs.readFileSync("pot.json", "utf8"));

const bot = new Discord.Client({

	disableEveryone: true

});

bot.commands = new Discord.Collection();

let cyan = botconfig.cyan;

fs.readdir("./commands/", (err, files) => {

	if (err) console.log(err);

	let jsfile = files.filter(f => f.split(".").pop() === "js")

	if (jsfile.length <= 0) {

		console.log("Geen commando's gevonden.");

		return;

	}

	jsfile.forEach((f, i) => {

		let props = require(`./commands/${f}`);

		console.log(`${f} geladen!`);

		bot.commands.set(props.help.name, props);

	});

});

bot.on("ready", async () => {

	console.log(`${bot.user.username} is online!`);

	bot.user.setActivity("in Golden Palace");

});

bot.on("guildMemberAdd", member => {

	let icon = bot.user.displayAvatarURL;

	let embed = new Discord.RichEmbed().setThumbnail(icon).setColor("#00ffff").setTitle("Welkom bij Golden Palace!").setDescription("Lees dit goed door").addBlankField().addField("Wat moet ik doen?", "Bekijk eerst het kanaal: " + "[#bot-commands](https://discordapp.com/channels/422892937022668822/437924057166643211)").addBlankField().addField("Verder nog iets?", "Laat eventueel je verjaardag achter in: [#kletschat](https://discordapp.com/channels/422892937022668822/422892937488105475) zodat er een melding van kan komen :)").setFooter("Heel veel geluk en plezier in Golden Palace!");

	member.send(embed)

});

bot.on("message", async message => {

	if (message.author.bot) return;

	if (message.channel.type === "dm") return;

	let prefix = botconfig.prefix;

	let messageArray = message.content.split(" ");

	let cmd = messageArray[0];

	let args = messageArray.slice(1);

	let commandfile = bot.commands.get(cmd.slice(prefix.length));

	if (commandfile) commandfile.run(bot, message, args);

	// Start warning system

	if (cmd === `${prefix}waarschuwing`) {

		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" Je hebt hier geen rechten voor.");

		let wUser = args.join(" ");

		if (!warns[wUser]) warns[wUser] = {

			warns: 0

		};

		warns[wUser].warns++;

		fs.writeFile("warnings.json", JSON.stringify(warns), (err) => {

			if (err) console.log(err);

		});

		let warnEmbed = new Discord.RichEmbed().setDescription("Heeft een nieuwe waarschuwing aangemaakt").setAuthor(message.author.username).setColor(cyan).addField("Waaschuwing voor", wUser).addField("Aantal waarschuwingen", warns[wUser].warns);

		let kanaal = message.guild.channels.find("name", "dealers-waarschuwingen");

		if (!kanaal) return message.reply(" Ik kan het kanaal: " + kanaal + " niet vinden.");

		message.delete().catch(O_o => {});

		kanaal.send(warnEmbed);

		return message.reply(" Je hebt een dealer waarschuwing aangemaakt, bekijk de melding in " + kanaal + " of bekijk alle waarschuwingen met !all");

	}

	if (cmd === `${prefix}verwijderwaarschuwing`) {

		let wUser = args.join(" ");

		warns[wUser].warns--;

		fs.writeFile("warnings.json", JSON.stringify(warns), (err) => {

			if (err) console.log(err);

		});

		message.reply("\n" + "Aantal waarschuwingen van " + wUser + " is verminderd met 1." + "\n" + "Nieuw aantal:" + "\n" + "**" + warns[wUser].warns + "**");

		message.delete().catch();

	}

	if (cmd === `${prefix}all`) {

		message.channel.send(Object.keys(warns).reduce((report, username) => {

			report += `${username}: ${warns[username].warns}\n`

			return report

			message.delete().catch();

		}, ''))

	}

	// End warning system    

	// Start vault system

	if (cmd === `${prefix}pot`) {

		if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(" Je hebt hier geen rechten voor.");

		let wUser = "pot";

		if (!warns[wUser]) warns[wUser] = {

			warns: 0

		};

		warns[wUser] = (args[0]);

		fs.writeFile("pot.json", JSON.stringify(warns), (err) => {

			if (err) console.log(err);

		});

		let reden = (args.join(" ").slice(0));

		let warnEmbed = new Discord.RichEmbed().setDescription("Heeft de vergoedingspot bijgewerkt").setAuthor(message.author.username).setColor(cyan).addField("Bedrag na verandering", (args[0])).addField("Reden verandering", reden);

		let kanaal = message.guild.channels.find("name", "vergoedingspot-informatie");

		if (!kanaal) return message.reply(" Ik kan het kanaal: " + kanaal + " niet vinden.");

		message.delete().catch(O_o => {});

		kanaal.send(warnEmbed);

		return message.reply(" Je hebt de vergoedingspot bijgewerkt met de volgende reden: " + "**" + reden + "**" + ". Ik heb de verandering opgeslagen in " + kanaal);

	}

	if (cmd === `${prefix}aantalpot`) {

		let aantal = pot.pot;

		message.reply("\n" + "Er zitten op dit moment: " + "\n" + "**" + aantal + "**" + "\n" + "Credit(s) in vergoedingspot.");

	}

	// End vault system  

	// Start command log

	let mod = message.client.users.get("405778045941841923");

	if (message.content.match(/^\!/)) {

		let args = messageArray.slice(0);

		let msgauthor = message.author.username;

		let thiscommand = (args[0]);

		mod.send("**" + msgauthor + "**" + " Heeft een commando gebruikt: " + thiscommand);

	}

	// End command log

	if (message.content.match(/@everyone/i)) {
		let args = messageArray.slice(0);

		let rol = message.guild.roles.find("name", "Tag");
		let content = args.join(" ");

		let member = message.author.id;

		if (!message.member.roles.has(rol.id)) {

			message.delete().catch();

			message.reply("Je bericht is niet verzonden, bekijk je privé berichten voor meer informatie");

			message.author.send("Je bericht: "+"***"+content+"***"+" is niet verzonden omdat je de Tag rol niet hebt. "+"Gebruik @here, vraag een beheerder om de rol toe te voegen of voeg de rol zelf toe als je hier de rechten voor hebt. (@everyone wordt alleen gebruikt bij belangrijke berichten)");

		}

		if (message.member.roles.has(rol.id)) {

			await message.member.removeRole(rol.id);

		}

	}

const list = ['!delete', '!meld', '!zeg', '!vote', '!waarschuwing', '!verwijderwaarschuwing', '!all', '!pot', '!accepteer', '!pf', '!delete', '!ontslagen', '!check'];

if (message.content.match(/^\!/)) {
	let args = messageArray.slice(0);
	let input = (args[0]);
if (input.length > 2 && !list.includes(input)) {
	message.reply("*"+input+"*" + " is geen geldig commando, bedoelde je: " + didYouMean(input, list) + "?");
}
}

if (!cmd.startsWith("!") && message.content.match(/!/i)) {
	message.react("👀");
}

});

bot.login(botconfig.token);