const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const prezidents = require('../database/prezidents.js');

module.exports = new Modal({
    modalID: "prezidentRequestModal",
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (isNaN(interaction.fields.getTextInputValue("age")) || +interaction.fields.getTextInputValue("age") < 14) return await client.dsHelper.ErrorEmbed(client, interaction, "Это не ответ! [Поле: Возраст кандидата, Доступные варианты: Возраст (Начиная с 14)]", true, true);
        const ticketInfo = await client.tickets.createTicket(interaction, client.config.Guild.categories.prezidentCategory, {
            channelName: `┃${interaction.user.username}`,
            topic: `Заявка на президенство от игрока ${interaction.fields.getTextInputValue("nickname")}`,
            permissonOverwrites: [
                {
                    id: interaction.member.id,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: client.config.Guild.roles.player,
                    allow: [Discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: client.config.Guild.roles.support,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                }
            ]
        }, {replyEmbed: {ephemeral: true, embed: {
            author: { name: "Заявка на президенство" },
            description: `Вы успешно подали заявку на президенство!`,
            color: 3092790
        }}, ticketChannelEmbed: {embed: {
            title: `**КАНДИДАТ В ПРЕЗИДЕНТЫ**`,
            description: "Здравствуйте. Вам необходимо рассказать другим про ваши планы президентства.",
            fields: [{
                name: "Никнейм кандидата:",
                value: `\`${interaction.fields.getTextInputValue("nickname")}\``,
                inline: true
            }, {
                name: "Возраст:",
                value: `\`${interaction.fields.getTextInputValue("age")}\``,
                inline: true
            }, {
                name: "Немного о себе:",
                value: `\`${interaction.fields.getTextInputValue("aboutYou")}\``,
                inline: false
            }],
            image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1075502966116712468/Anniversary_Blog.jpeg"},
            color: 3092790
        }, components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Закрыть",
                style: Discord.ButtonStyle.Secondary,
                custom_id: "closePrezidentbtn" 
            }]
        }]}, adminLogEmbed: {
            embed: {
                author: { name: "Заявка на президенство!" },
                description: `${interaction.member} подал заявку на президенство!`,
                image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1074072351370645567/5d160a60611d6907.png"},
                color: 3092790
            }
        }}, client.config.Guild.channels.adminLogs);

        await prezidents.create({
            _id: ticketInfo.MessageInfo.id,
            ids: {
                channelID: ticketInfo.ChannelInfo.id,
                authorID: interaction.user.id
            },
            info: {
                nickname: interaction.fields.getTextInputValue("nickname"),
                age: interaction.fields.getTextInputValue("age"),
                aboutYou: interaction.fields.getTextInputValue("aboutYou"),
            }
        })
    }
});