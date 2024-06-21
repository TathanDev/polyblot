const helpdb = require("../helpers/db-helper")

const { EmbedBuilder, ComponentType, ButtonBuilder, ButtonStyle, ActionRowBuilder, Component  } = require('discord.js');
const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus  } = require('@discordjs/voice');
const fs = require("fs");
const path = require("path");

module.exports.voiceHandler = async function (questions, interaction, channel) {
  
  const item = questions[Math.floor(Math.random() * questions.length)];

  const replay = new ButtonBuilder()
    .setCustomId('replayVoice')
    .setLabel('Replay')
    .setStyle(ButtonStyle.Success);

	const row = new ActionRowBuilder()
		.addComponents(replay);

  const message = await interaction.reply({ content: item.question, fetchReply: true , components: [row]})

  const filter = i => {
    i.deferUpdate();
    return i.user.id === interaction.user.id;
  };
  
  const buttonCollector = message.createMessageComponentCollector({filter, componentType: ComponentType.Button, time: 40_000 });


  const messageFilter = response => {
    return (item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()));
  };
  
  const collector = interaction.channel.createMessageCollector({ filter: messageFilter, time: 45_000 });
  

  const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    const player = createAudioPlayer();

    const commandsPath = path.join(__dirname, '../assets/voices/');
    const resource = createAudioResource(path.resolve(commandsPath, item.file));

    player.play(resource);

    connection.subscribe(player);

    let answered = false

    buttonCollector.on('collect', i => {
      if (answered) return
      let newResource = createAudioResource(path.resolve(commandsPath, item.file));
      player.play(newResource);
    });

    buttonCollector.on('end', i => {
      if(answered) return
      loose(null)
    });


    collector.on('collect', (message) => {
      helpdb.addUserStats(interaction.user.id, 1).then((stats) => {
        helpdb.updateWinStreak(interaction.user.id, true).then((stats) => {
          const answer = new EmbedBuilder()
          .setTitle("Correct !")
          .setDescription("You have now `" + stats.get("success") + "` success !")
          .setFooter({ text: "Win Streak: " + stats.get("streak") + " 🔥!"})
          .setColor(0x00ff00)

          message.reply({ embeds: [answer], ephemeral: true })

        })
      })
      answered = true
      collector.stop()
    })

    collector.on('end', (message) => {
      if (answered) return
      loose(message)
    })
    

    async function loose(collected) {
      let playerAnswer;
      if (collected == null) {
        playerAnswer = "No Answer"
      } else {
        playerAnswer = collected.values[0]
      }

      helpdb.updateWinStreak(interaction.user.id, false).then((stats) => {
          const answer = new EmbedBuilder()
          .setTitle("Wrong !")
          .setDescription("You have now `" + stats.get("success") + "` success !")
          .addFields(
              { name: "Question", value: item.question},
              { name: "Your Answer", value: playerAnswer},
              { name: "Correct Answer", value: item.answers[item.correct] }
          )
          .setFooter({ text: "Win Streak: " + stats.get("streak") + " 🔥!"})
          .setColor(0xff0000)
          interaction.followUp({ embeds: [answer], ephemeral: true })
          answered = true
      })
  }
}
