const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');
const applications = require('../../database/applications');

module.exports = new Component({
    componentID: "closeApplicationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        if (!await applications.exists({ _id: interaction.message.id })) return client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке")
        await client.tickets.closeTicket(client, interaction, {
            embed: {
                title: "Вы действительно отказываетесь? Заявка будет закрыта.",
                description: "После закрытия заявки данный канал будет удален.",
                image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1076859608674619392/d40ade460b562945.png" },
                color: 3092790
            },
            model: applications,
            userIDModelName: "authorID",
            closeBtnID: "closeApplicationConfrmbtn",
            acceptClosingCreator: true,
            _id: interaction.message.id
        }, async (i, m) => {
            await i.message.delete();
            await i.reply({embeds: [client.MessageInfo.closeTicket.embed]})
            const c = i.guild.channels.cache.find(x => x.id == client.config.Guild.channels.applicationsLogs && x.type == Discord.ChannelType.GuildText);
            c.messages.fetch(m.ids.adminMsgID).then(async (msg) => {
                let embed = msg.embeds[0];
                embed.data.description = `・ **Статус:** Закрыта\n・ **Пользователь:** ${i.user}\n`
                embed.data.color = Discord.Colors.DarkButNotBlack;
                await msg.edit({ embeds: [embed] })
            })
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи заявки на проходку`},
                description: `Для просмотра лога скачайте его и откройте в браузере`,
                color: Discord.Colors.DarkButNotBlack
            }], `applicationsLogs-${m.ids.authorID}`, config.Guild.channels.ticketLogs);
            await i.channel.delete();
            await m.deleteOne();
        })
    }
});