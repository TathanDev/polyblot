
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

const voiceHelp = require("../helpers/voice-helper")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('voice')
		.setDescription('Train to listen !')
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
				interaction.reply({content: "You are not in a voice channel. You need to be in a voice channel to play this game.", ephemeral:true})
				return
			}
			voiceHelp.voiceHandler(file.voices, interaction, member.voice.channel)
			
		}) 
	}
};  