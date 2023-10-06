const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const joinGuilds = require('../database/joinGuilds.js');

module.exports = new Modal({
    modalID: "joinGuildModal",
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const ticketInfo = await client.tickets.createTicket(interaction, client.config.Guild.categories.joinGuildCategory, {
            channelName: `┃${interaction.user.username}`,
            topic: `Заявка на вступление в гильдию от игрока ${interaction.fields.getTextInputValue("nickname")}`,
        }, {replyEmbed: {ephemeral: true, embed: {
            author: { name: "Заявка на вступление в гильдию" },
            description: `Вы успешно подали заявку на вступление в гильдию!`,
            color: 3092790
        }}, ticketChannelEmbed: {embed: {
            title: `**ЗАЯВКА В ГИЛЬДИЮ**`,
            fields: [{
                name: "Никнейм игрока:",
                value: `\`${interaction.fields.getTextInputValue("nickname")}\``,
                inline: true
            }, {
                name: "Активность:",
                value: `\`${interaction.fields.getTextInputValue("activity")}\``,
                inline: true
            }, {
                name: "Немного о себе:",
                value: `\`\`\`${interaction.fields.getTextInputValue("aboutYou")}\`\`\``,
                inline: false
            }],
            image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1075502963767922758/Mountain_Blog.webp"},
            color: 3092790
        }, components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Выбрать гильдию",
                style: 1,
                custom_id: "selectGuildbtn"
            },{
                type: 2,
                label: "Закрыть",
                style: Discord.ButtonStyle.Secondary,
                custom_id: "closeJoinGuildbtn" 
            }]
        }]}}, client.config.Guild.channels.adminLogs);

        await joinGuilds.create({
            _id: ticketInfo.MessageInfo.id,
            ids: {
                channelID: ticketInfo.ChannelInfo.id,
                authorID: interaction.user.id
            },
            info: {
                nickname: interaction.fields.getTextInputValue("nickname"),
                activity: interaction.fields.getTextInputValue("activity"),
                aboutYou: interaction.fields.getTextInputValue("aboutYou")
            }
        })
    }
});