const Component = require('../../structure/component');
const Discord = require('discord.js');
const builds = require('../../database/builds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "closeBuildbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (!await builds.exists({ _id: interaction.message.id })) return await client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке", true, true)
        if (interaction.user.id != (await builds.findOne({_id: interaction.message.id})).ids.authorID) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true)
        await client.tickets.closeTicket(client, interaction, {
            model: builds,
            userIDModelName: "authorID",
            closeBtnID: "closeBuildConfrmbtn",
            acceptClosingCreator: true,
            _id: interaction.message.id
        }, async (i, m) => {
            await i.message.delete();
            await i.reply({embeds: [client.MessageInfo.closeTicket.embed]})
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи заявки на постройку`},
                description: `・ **Закрыл заявку:** ${i.user}`,
                footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
                color: Discord.Colors.DarkButNotBlack
            }], `buildLogs-${m.ids.authorID}`, config.Guild.channels.ticketLogs);
            await i.channel.delete();
            m.deleteOne();
        })
    }
});