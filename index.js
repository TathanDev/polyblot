const { Client, Events, Collection, ActivityType, GatewayIntentBits, ButtonBuilder , ButtonStyle, ActionRowBuilder} = require('discord.js');
const Sequelize = require('sequelize');

const config = require('./config/config.json');
const fs = require('node:fs');
const path = require('node:path');
const bot = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});
const dbhelp = require('./helpers/db-helper.js');

bot.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const { generateDependencyReport } = require('@discordjs/voice');


const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});


bot.once(Events.ClientReady, () => {
	console.log('Ready !');
	console.log(`Logged as ` + bot.user.username)
	bot.user.setPresence({ activities: [{ name: `status`, type: ActivityType.Custom, state: `Learn new Languages 🏳️` }] })
	console.log(generateDependencyReport());


	dbhelp.Stats.sync();
});


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	bot.commands.set(command.data.name, command);
	console.log(command.data.name)
} 


bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, bot);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "No it's broken !.\nJe te conseille de MP TATHAN#0007.\n \n```js\n" + `${error}` + "\n```\nCommand : " + `${interaction}` , ephemeral: true });        

	}
});

bot.login(config.testToken);

