const Component = require('../../structure/component');
const Discord = require('discord.js');
const reportRequests = require('../../database/reportRequests');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "closeReportbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (!await reportRequests.exists({ _id: interaction.message.id })) return await client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой жалобе")
        await client.tickets.closeTicket(client, interaction, {
            embed: {
                title: "**ВЫ УВЕРЕНЫ В ЗАКРЫТИИ ДАННОЙ ЖАЛОБЫ?**",
                description: "После закрытия жалобы данный канал будет удален и логи беседы будут отправлены в лог канал.",
                image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1076859608674619392/d40ade460b562945.png" },
                color: 3092790
            },
            model: reportRequests,
            userIDModelName: "authorID",
            closeBtnID: "closeReportConfrmbtn",
            acceptClosingCreator: true,
            _id: interaction.message.id
        }, async (i, m) => {
            await i.message.delete();
            await i.reply({embeds: [client.MessageInfo.closeTicket.embed]})
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи жалобы на игрока ${m.info.reportNickname}`},
                description: `・ **Закрыл заявку:** ${i.user}`,
                footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
                color: Discord.Colors.DarkButNotBlack
            }], `reportLogs-${m.ids.authorID}-${m.info.reportNickname}`, config.Guild.channels.ticketLogs, true);
            await i.channel.delete();
            m.deleteOne();
        })
    }
});