const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const config = require('../../jsons/config.json');
const guildHelper = require('../../libs/guildHelper.js');

module.exports = new Component({
    componentID: "acceptCreateNeutralGuildbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const guild = await guilds.findOne({ _id: interaction.channel.id });
        if (!guild) return client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой гильдии");
        await interaction.deferReply();

        await guildHelper.acceptCreateGuild(client, interaction, true);

        await client.tickets.sendTicketLog(client, interaction, [{
            author: { name: `Логи создания гильдии от игрока ${guild.info.ownerName}`},
            description: `・ **Закрыл заявку:** ${interaction.user}`,
            footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
            color: Discord.Colors.DarkButNotBlack
        }], `createGuildLog-${guild.info.name}`, config.Guild.channels.ticketLogs);

        await interaction.channel.delete();
    }
});