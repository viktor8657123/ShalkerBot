//Некоторые мои приколюхи
//by DesConnet
const Discord = require('discord.js');
const Client = require('../structure/client');
const config = require('../jsons/config.json');

class DSHelper {
    /**
     * Вывод ошибки в embed стиле
     * @param {Client} client 
     * @param {Discord.BaseInteraction | Discord.CommandInteraction | Discord.ButtonInteraction | Discord.ModalSubmitInteraction} interaction
     * @param {string} text
     * @param {boolean} ephemeral
     * @param {boolean} replied
     * @param {boolean} component
     */
    async ErrorEmbed(client, interaction, text = "Произошла непредвиденная ошибка...", ephemeral = config.General.defaultEphemeralError, component = false, replied = false, inLogChannel = false) {
        let errembed = new Discord.EmbedBuilder()
        .setColor('Red')
        .setAuthor({
            name: interaction.user.tag,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        .addFields([{
            name: component ? "Компонент:" : "Команда:",
            value: component ? `${interaction.customId}` : `/${interaction.commandName}`,
            inline: false
        }, {
            name: "Причина:",
            value: `${text}`,
            inline: false
        }])
        .setFooter({
            text: `${interaction?.guild?.name ?? client.user.username}`,
            iconURL: client.user.displayAvatarURL({dynamic: true})
        });

        if (inLogChannel) {
            const c = interaction.guild.channels.cache.find(x => x.id == config.Guild.channels.adminLogs && x.type == Discord.ChannelType.GuildText)
            await c.send({ embeds: [errembed] });
        } else (interaction.replied || interaction.deferred) ? await interaction.editReply({ embeds: [errembed] }) : await interaction.reply({ embeds: [errembed], ephemeral })
    };
}

module.exports = DSHelper;