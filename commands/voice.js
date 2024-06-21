
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

const config = require("../config.json")
const helpdb = require("../helpers/db-helper")
const voiceHelp = require("../helpers/voice-helper")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Your stats !')
		.addStringOption(option =>
			option.setName('language')
				.setDescription('Which Language ?')
				.setRequired(true)
				.addChoices(
					{ name: 'French', value: 'fr' },
				)),

    async execute(interaction, bot) {
		
		const language = interaction.options.getString('language');

		const file = require(`../quizzes/en_${language}.json`)
  
		interaction.guild.members.fetch(interaction.user.id).then((member) => {

			if (!member.voice.channel) {
				interaction.reply("You are not in a voice channel. You need to be in a voice channel to play this game.")
				return
			}
			voiceHelp.voiceHandler(file.voices, interaction, member.voice.channel)
			
		}) 
	}
};  