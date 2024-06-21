
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const helpdb = require("../helpers/db-helper")
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('The best polyglot in discord !'),


    async execute(interaction, bot) {
      
    const answer = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setColor(0x00ff00)
      .setThumbnail(interaction.guild.iconURL());

    
  
      await interaction.reply({ content: "loading leaderboard...", ephemeral: false})

      helpdb.Stats.findAll({ order: [['success', 'DESC']] }).then(async (stats) => {
        let i = 1
        if (i <= 25) {
          for (const stat of stats) {
            await bot.users.fetch(stat.id).then((member) => {

              let specialText = `#${i}`

              if (i == 1) {
                specialText = "🥇"
              } else if (i == 2) {
                specialText = "🥈"
              } else if (i == 3) {
                specialText = "🥉"
              }


              answer.addFields({name: `#${specialText} - ${member.username}`,value: `Win : ${stat.get("success")} | Best Win Streak : ${stat.get("bestStreak")}`})
              i++
              interaction.editReply({ embeds: [answer], ephemeral: false})

            })
          }
        }
      })
	},
};  