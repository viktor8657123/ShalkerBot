const Component = require('../../structure/component');
const Discord = require('discord.js');
const joinGuilds = require('../../database/joinGuilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "closeJoinGuildbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (!await joinGuilds.exists({ _id: interaction.message.id })) return await client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке", true, true)
        if (interaction.user.id != (await joinGuilds.findOne({_id: interaction.message.id})).ids.authorID) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true)
        await client.tickets.closeTicket(client, interaction, {
            model: joinGuilds,
            userIDModelName: "authorID",
            closeBtnID: "closeJoinGuildConfrmbtn",
            acceptClosingCreator: true,
            _id: interaction.message.id
        }, async (i, m) => {
            
            await i.message.delete();
            await i.reply({embeds: [client.MessageInfo.closeTicket.embed]})
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи заявки на вступление в гильдию от игрока ${m.info.nickname}`},
                description: `・ **Закрыл заявку:** ${i.user}`,
                footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
                color: Discord.Colors.DarkButNotBlack
            }], `joinGuildsLogs-${m.ids.authorID}`, config.Guild.channels.ticketLogs);
            await i.channel.delete();
            await m.deleteOne();
        })
    }
});