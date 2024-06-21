
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const config = require("../config.json")
const helpdb = require("../helpers/db-helper")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Your stats !'),

    async execute(interaction, bot) {

      helpdb.getUserStats(interaction.user.id).then((stats) => {
        const answer = new EmbedBuilder()
        .setTitle("Stats")
        .addFields(
          { name: "Win Streak 🔥", value: `${stats.get("streak")}`},
          { name: "Best Win Streak", value: `${stats.get("bestStreak")}`},
          { name: "Win", value: `${stats.get("success")} `, }
        )
        .setColor(0x00ff00)
        .setThumbnail(interaction.user.avatarURL())

        interaction.reply({ embeds: [answer], ephemeral: false })
      })
	},
};  