const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const applications = require('../database/applications.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "applicationModal",
    permission: "SendMessages",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        let Embed = {
            author: { name: `АНКЕТА ПОЛЬЗОВАТЕЛЯ`, icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}` },
            fields: [{
                name: "Игровой никнейм:",
                value: `\`\`\`${interaction.fields.getTextInputValue("nickname")}\`\`\``,
                inline: false
            }, {
                name: "Почему вы выбрали нас?",
                value: `\`\`\`${interaction.fields.getTextInputValue("reasonApplication")}\`\`\``,
                inline: false
            }, {
                name: "Расскажите что хотите делать на проекте?",
                value: `\`\`\`${interaction.fields.getTextInputValue("plans")}\`\`\``,
                inline: false
            }, {
                name: "Прочитали ли вы правила?",
                value: `\`\`\`${interaction.fields.getTextInputValue("readRules")}\`\`\``,
                inline: false
            }, {
                name: "Биография пользователя:",
                value: `\`\`\`${interaction.fields.getTextInputValue("aboutYou")}\`\`\``,
                inline: false
            }],
            image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1086741622433267763/HH4Pr0l8voQ.jpg"},
            color: 3092790,
            footer: { text: `Заявка рассматривается поддержкой в течении 24 часов!`}
        }


        const ticket = await client.tickets.createTicket(interaction, client.config.Guild.categories.applicationCategory, {
            channelName: `┃${interaction.user.username}}`,
            topic: `Заявка на проходку Schalker Vanilla.`
        }, {
            replyEmbed: {
                ephemeral: true, embed: {
                    author: { name: "Заявка на проходку" },
                    description: `Вы успешно подали заявку на проходку.`,
                    color: 3092790
                }
            }, ticketChannelEmbed: {
                embed: Embed, components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: "Принять",
                        style: Discord.ButtonStyle.Success,
                        custom_id: "acceptApplicationbtn"
                    }, {
                        type: 2,
                        label: "Отклонить",
                        style: Discord.ButtonStyle.Danger,
                        custom_id: "denyApplicationbtn"
                    }, {
                        type: 2,
                        label: "Подписка",
                        style: Discord.ButtonStyle.Primary,
                        custom_id: "subscribeApplicationbtn"
                    }, {
                        type: 2,
                        label: "Оплата",
                        style: Discord.ButtonStyle.Danger,
                        custom_id: "paymentsApplicationbtn"
                    }, {
                        type: 2,
                        label: "Удалить",
                        style: Discord.ButtonStyle.Secondary,
                        custom_id: "closeApplicationbtn"
                    }]
                }]
            }
        });

        const c = interaction.guild.channels.cache.find(x => x.id == client.config.Guild.channels.applicationsLogs && x.type == Discord.ChannelType.GuildText)
        Embed.description = `・ **Статус:** Рассматривается\n・ **Канал для связи:** [Нажми здесь](${ticket.ChannelInfo.url})\n`;
        Embed.footer.text = `Примите решение перейдя в канал для связи и выбрав одну из кнопок`;
        const adminMsg = await c.send({
            embeds: [Embed]
        });

        await applications.create({
            _id: ticket.MessageInfo.id,
            ids: {
                authorID: interaction.user.id,
                adminMsgID: adminMsg.id,
                channelID: ticket.ChannelInfo.id
            },
            info: {
                nickname: interaction.fields.getTextInputValue("nickname"),
                reportApplication: interaction.fields.getTextInputValue("reasonApplication"),
                plans: interaction.fields.getTextInputValue("plans"),
                readRules: interaction.fields.getTextInputValue("readRules"),
                aboutYou: interaction.fields.getTextInputValue("aboutYou"),
                status: "Рассматривается"
            }
        });
    }
});