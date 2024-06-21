
const { SlashCommandBuilder, TextInputBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

const config = require("../config.json")
const helpdb = require("../helpers/db-helper")
const questionHelp = require("../helpers/question-helper")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('exercice')
		.setDescription('Learn new language !')
    .addStringOption(option =>
			option.setName('language')
				.setDescription('Which Language ?')
				.setRequired(true)
				.addChoices(
					{ name: 'Spanish', value: 'es' },
					{ name: 'French', value: 'fr' },
				)),

    async execute(interaction, bot) {

      const language = interaction.options.getString('language');

      const file = require(`../quizzes/en_${language}.json`)
      
      let questions = file.translate
      const type = Math.floor(Math.random() * 2)
      switch(type) {
        case 0:
          questions = file.translate
          questionHelp.translateHandler(questions, interaction)
          break;
        case 1:
          questions = file.choices
          questionHelp.choicesHandler(questions, interaction)

          break;
      }

	},
};  