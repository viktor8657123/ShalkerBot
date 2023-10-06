const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const reportRequests = require('../database/reportRequests');

module.exports = new Modal({
    modalID: "reportRequestModal",
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const ticketInfo = await client.tickets.createTicket(interaction, client.config.Guild.categories.reportCategory, {
            channelName: `┃${interaction.user.username}`,
            topic: `Жалоба на игрока ${interaction.fields.getTextInputValue("reportNickname")}`
        }, {replyEmbed: {ephemeral: true, embed: {
            author: { name: "Жалоба" },
            description: `Вы успешно подали жалобу.`,
            color: 3092790
        }}, ticketChannelEmbed: {embed: {
            title: `**ЖАЛОБА ИГРОКА**`,
            fields: [{
                name: "Ваш ник:",
                value: `\`${interaction.fields.getTextInputValue("nickname")}\``,
                inline: true
            }, {
                name: "Ник нарушителя:",
                value: `\`${interaction.fields.getTextInputValue("reportNickname")}\``,
                inline: true
            }, {
                name: "Ваша жалоба:",
                value: `\`${interaction.fields.getTextInputValue("reportReason")}\``,
                inline: false
            }],
            image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1075502964476743771/Badlands_Blog.jpg"},
            color: 3092790
        }, components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Закрыть",
                style: Discord.ButtonStyle.Secondary,
                custom_id: "closeReportbtn" 
            }]
        }]}, adminLogEmbed: {
            embed: {
                author: { name: "Жалоба!" },
                description: `${interaction.member} подал жалобу!`,
                image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1074072368365981736/4683d0cb36f072e4.png"},
                color: 3092790
            }
        }}, client.config.Guild.channels.adminLogs);

        await reportRequests.create({
            _id: ticketInfo.MessageInfo.id,
            ids: {
                channelID: ticketInfo.ChannelInfo.id,
                authorID: interaction.user.id
            },
            info: {
                reportNickname: interaction.fields.getTextInputValue("reportNickname"),
                reportReason: interaction.fields.getTextInputValue("reportReason"),
            }
        })
    }
});