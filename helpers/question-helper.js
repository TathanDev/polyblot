const helpdb = require("../helpers/db-helper")
const { EmbedBuilder, ComponentType, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder  } = require('discord.js');


module.exports.translateHandler = async function (questions, interaction) {
    const item = questions[Math.floor(Math.random() * questions.length)];
      
    const collectorFilter = response => {
      return (item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()));
    };

    interaction.reply({ content: item.question, fetchReply: true })
    
    const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 5_000 });
    
    let answered = false

    collector.on('collect', (message) => {
      answered = true
      helpdb.addUserStats(interaction.user.id, 10).then((stats) => {
        helpdb.updateWinStreak(interaction.user.id, true).then((stats) => {
          const answer = new EmbedBuilder()
          .setTitle("Correct !")
          .setDescription("You have now `" + stats.get("success") + "` success !")
          .setFooter({ text: "Win Streak: `" + stats.get("streak") + "` 🔥!"})
          .setColor(0x00ff00)

          message.reply({ embeds: [answer], ephemeral: true })

        })
      })
      collector.stop()
    })

    collector.on('end', (message) => {
      if (answered) return
            helpdb.addUserStats(interaction.user.id, -1).then((stats) => {
              helpdb.updateWinStreak(interaction.user.id, false).then((stats) => {
                
                const answer = new EmbedBuilder()
                .setTitle("Wrong !")
                .setDescription("You have now `" + stats.get("success") + "` success !")
                .addFields(
                    { name: "Question", value: item.question},
                    { name: "Correct Answer", value: item.answers[0] }
                )
                .setFooter({ text: "Win Streak: " + stats.get("streak") + " 🔥!"})
                .setColor(0xff0000)
                interaction.followUp({ embeds: [answer], ephemeral: true })
            })
      })
    })

}

module.exports.choicesHandler = async function (questions, interaction) {

    const item = questions[Math.floor(Math.random() * questions.length)];
    

    const select = new StringSelectMenuBuilder()
    .setCustomId('starter')
    .setPlaceholder('Make a selection!')

    item.answers.forEach(element => {
        select.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(element)
                .setValue(element)
        )
    })
    

    const row = new ActionRowBuilder()
        .addComponents(select);


    const message = await interaction.reply({ content: item.question, fetchReply: true, components: [row] })
    
    const filter = i => {
        i.deferUpdate();
        return i.user.id === interaction.user.id;
    };

    const collector = message.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 15_000 });

    let answered = false

    collector.on('collect', i => {
        let playerAnswer = i.values[0].toLowerCase()
        if (playerAnswer === item.answers[item.correct].toLowerCase()) {
            helpdb.addUserStats(interaction.user.id, 10).then((stats) => {
                helpdb.updateWinStreak(interaction.user.id, true).then((stats) => {
                    const answer = new EmbedBuilder()
                    .setTitle("Correct !")
                    .setDescription("You have now `" + stats.get("success") + "` success !")
                    .setFooter({ text: "Win Streak: " + stats.get("streak") + " 🔥!"})
                    .setColor(0x00ff00)
                    interaction.followUp({ embeds: [answer], ephemeral: true })
                    answered = true
                    collector.stop()
                })
            })
        } else {
            answered = true
            loose(i)
            collector.stop()
        }
        
    });

    collector.on('end', collected => {
        if (answered) return
        loose(collected)
    });

    async function loose(collected) {
        helpdb.updateWinStreak(interaction.user.id, false).then((stats) => {
            const answer = new EmbedBuilder()
            .setTitle("Wrong !")
            .setDescription("You have now `" + stats.get("success") + "` success !")
            .addFields(
                { name: "Question", value: item.question},
                { name: "Your Answer", value: collected.values[0]},
                { name: "Correct Answer", value: item.answers[item.correct] }
            )
            .setFooter({ text: "Win Streak: " + stats.get("streak") + " 🔥!"})
            .setColor(0xff0000)
            interaction.followUp({ embeds: [answer], ephemeral: true })
            answered = true
        })
    }
}



