const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "joinGuildInformationMenu",
    componentType: Discord.ComponentType.StringSelect,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const guild = await guilds.findOne({_id: interaction.values[0]});
        await interaction.reply({
            embeds: [{
                title: guild.info.name,
                description: guild.info.description ?? "Описание отсутствует",
                footer: { text: `Глава гильдии: ${guild.info.ownerName}`},
                image: { url: "https://cdn.discordapp.com/attachments/979314132711014430/1076578890341949520/New_Year_Blog.jpeg" }
            }],
            ephemeral: true
        })
    }
});