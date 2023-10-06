const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const joinGuilds = require('../../database/joinGuilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "selectGuildMenu",
    componentType: Discord.ComponentType.StringSelect,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const joinGuild = await joinGuilds.findOne({ "ids.channelID": interaction.channel.id });
        const guild = await guilds.findOne({_id: interaction.values[0]});
        const guildCreator = await interaction.guild.members.fetch(guild.ids.authorID);

        joinGuild.ids.guildID = guild._id;
        await joinGuild.save();

        await interaction.channel.permissionOverwrites.edit(guildCreator, {
            SendMessages: true,
            ViewChannel: true
        })
        await interaction.message.delete();
        await interaction.reply({ content: `||${guildCreator}||`, embeds: [{
            title: "**ГЛАВА НА СВЯЗИ**",
            description: "Глава гильдии - собственно, создатель гильдии и ответственный за руководство ею. Ему доступен весь функционал гильдии.",
            color: 3092790,
            image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1076609731826819163/d029d669644db04b.png"}
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Принять",
                custom_id: "joinGuildAcceptbtn",
                style: Discord.ButtonStyle.Success
            }, {
                type: 2,
                label: "Отклонить",
                custom_id: "joinGuildDenybtn",
                style: Discord.ButtonStyle.Danger
            }]
        }]});
    }
});