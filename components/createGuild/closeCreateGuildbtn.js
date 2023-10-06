const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "closeCreateGuildbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        await client.tickets.closeTicket(client, interaction, {
            embed: {
                title: "Вы действительно отказываетесь? Заявка будет закрыта.",
                description: "После закрытия заявки данный канал будет удален.",
                image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1076859608674619392/d40ade460b562945.png" },
                color: 3092790
            },
            _id: interaction.channel.id,
            userIDModelName: "guildCreatorID",
            model: guilds,
            closeBtnID: "closeCreateGuildConfirm",
            acceptClosingCreator: true
        }, async (i, m) => {
            await i.reply({embeds: [client.MessageInfo.closeTicket.embed]})
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи создания гильдии от игрока ${m.info.ownerName}`},
                description: `・ **Закрыл заявку:** ${i.user}`,
                footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
                color: Discord.Colors.DarkButNotBlack
            }], `createGuildLogs-${m.info.authorID}`, config.Guild.channels.ticketLogs);
            await i.channel.delete();
            await m.deleteOne();
        })
    }
});