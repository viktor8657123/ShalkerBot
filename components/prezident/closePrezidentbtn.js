const Component = require('../../structure/component');
const Discord = require('discord.js');
const prezidents = require('../../database/prezidents');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "closePrezidentbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (!await prezidents.exists({ _id: interaction.message.id })) return await client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке", true, true)
        if (interaction.user.id != (await prezidents.findOne({_id: interaction.message.id})).ids.authorID && !interaction.member.roles.cache.has(client.config.Guild.roles.support)) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true)
        await client.tickets.closeTicket(client, interaction, {
            model: prezidents,
            userIDModelName: "authorID",
            closeBtnID: "closePrezidentConfrmbtn",
            acceptClosingCreator: true,
            _id: interaction.message.id
        }, async (i, m) => {
            await i.message.delete();
            await i.reply({embeds: [client.MessageInfo.closeTicket.embed]})
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи заявки на президенство`},
                description: `・ **Закрыл заявку:** ${i.user}`,
                footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
                color: Discord.Colors.DarkButNotBlack
            }], `prezidentLogs-${m.ids.authorID}`, config.Guild.channels.ticketLogs, true);
            await i.channel.delete();
            m.deleteOne();
        })
    }
});