
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

const voiceHelp = require("../helpers/voice-helper")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('contribute')
		.setDescription('Do you want to add a new lang ?'),

    async execute(interaction, bot) {
		const newLang = new EmbedBuilder()
        .setTitle("Want to add new langs ?")
        .setDescription("For the moment, **Polyblot** only support two langs, `French` and `Spanish`.\nWhy Because I, the creator of the bot, speak French, Spanish and English.\nYou can add your own language by opening a pull request on the **github**.")
		.addFields(
			{ name: 'Github', value: '[link](https://github.com/TathanDev/polyblot)', inline: true },
			{ name: 'Add a lang', value: '[link](https://github.com/TathanDev/polyblot/pulls)', inline: true },
			{ name: 'Find a bug/problem ?', value: '[link](https://github.com/TathanDev/polyblot/issues)', inline: true },
		)
		.setColor(0x00ff00)
		.setThumbnail(bot.user.displayAvatarURL())
		
		interaction.reply({ embeds: [newLang]})
	}
};  