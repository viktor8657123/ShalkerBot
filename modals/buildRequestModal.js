const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const builds = require('../database/builds.js');

module.exports = new Modal({
    modalID: "buildRequestModal",
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const ticketInfo = await client.tickets.createTicket(interaction, client.config.Guild.categories.buildCategory, {
            channelName: `┃${interaction.user.username}`,
            topic: `Заявка на постройку от игрока ${interaction.fields.getTextInputValue("nickname")}`,
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
                    id: client.config.Guild.roles.prezident,
                    allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages],
                },
                {
                    id: client.config.Guild.roles.support,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                }
            ]
        }, {replyEmbed: {ephemeral: true, embed: {
            author: { name: "Заявка на постройку" },
            description: `Вы успешно подали заявку на постройку!`,
            color: 3092790
        }}, ticketChannelEmbed: {embed: {
            title: `**ЗАЯВКА НА ПОСТРОЙКУ**`,
            fields: [{
                name: "Игровой никнейм:",
                value: `\`${interaction.fields.getTextInputValue("nickname")}\``,
                inline: true
            }, {
                name: "Ваша идея:",
                value: `\`${interaction.fields.getTextInputValue("idea")}\``,
                inline: true
            }, {
                name: "Ваши наигранные часы:",
                value: `\`${interaction.fields.getTextInputValue("playingHours")}\``,
                inline: false
            }],
            footer: { text: "Опишите постройку, дополнив скриншотами!" },
            image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1075502964208304300/Valentines_Blog.jpg"},
            color: 3092790
        }, components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Закрыть",
                style: Discord.ButtonStyle.Secondary,
                custom_id: "closeBuildbtn" 
            }]
        }]}, adminLogEmbed: {
            embed: {
                author: { name: "Заявка на постройку!" },
                description: `${interaction.member} подал заявку на постройку!`,
                image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1074072350733115472/556798300aae4486.png"},
                color: 3092790
            }
        }}, client.config.Guild.channels.adminLogs);

        await builds.create({
            _id: ticketInfo.MessageInfo.id,
            ids: {
                channelID: ticketInfo.ChannelInfo.id,
                authorID: interaction.user.id
            },
            info: {
                nickname: interaction.fields.getTextInputValue("nickname"),
                idea: interaction.fields.getTextInputValue("idea"),
                playingHours: interaction.fields.getTextInputValue("playingHours"),
            }
        })
    }
});