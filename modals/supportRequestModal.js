const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const supports = require('../database/supports.js');

module.exports = new Modal({
    modalID: "supportRequestModal",
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (isNaN(interaction.fields.getTextInputValue("age")) || +interaction.fields.getTextInputValue("age") < 16) return await client.dsHelper.ErrorEmbed(client, interaction, "Это не ответ! [Поле: Возраст, Доступные варианты: Возраст (Начиная с 16)]", true, true);
        if (isNaN(interaction.fields.getTextInputValue("age")) || +interaction.fields.getTextInputValue("age") > 10 || +interaction.fields.getTextInputValue("age") < 1) return await client.dsHelper.ErrorEmbed(client, interaction, "Это не ответ! [Поле: Оценка знаний, Доступные варианты: Положительное число (от 1 до 10)]", true, true);
        const ticketInfo = await client.tickets.createTicket(interaction, client.config.Guild.categories.supportCategory, {
            channelName: `┃${interaction.user.username}`,
            topic: `Заявка на пост поддержки от игрока ${interaction.fields.getTextInputValue("nickname")}`
        }, {
            replyEmbed: {
                ephemeral: true, embed: {
                    author: { name: "Заявка на пост поддержки" },
                    description: `Вы успешно подали заявку на пост поддержки!`,
                    color: 3092790
                }
            }, ticketChannelEmbed: {
                embed: {
                    title: `**ПОДДЕРЖКА**`,
                    description: "Мы не гарантируем, что даже с красивым резюме вы сможете стать на этот пост, ибо отбор очень строг. На обзвоне будут задаваться вопросы технического характера, будет проверка знаний \`Core_Protect\`. Задумайтесь о своих возможностях, если вы неуверены в своих знаниях и опыте ━ вам не рекомендуется заполнять данную анкету.",
                    fields: [{ name: '\u200B', value: '\u200B' },
                    {
                        name: "Никнейм:",
                        value: `\`${interaction.fields.getTextInputValue("nickname")}\``,
                        inline: true
                    }, {
                        name: "Возраст:",
                        value: `\`${interaction.fields.getTextInputValue("age")}\``,
                        inline: true
                    }, {
                        name: "Оценка знаний:",
                        value: `\`${interaction.fields.getTextInputValue("grade")}\``,
                        inline: false
                    },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'ДОПОЛНИТЕЛЬНЫЕ ВОПРОСЫ:', value: '\`\`\`1] Сколько лет вы играете в Minecraft?\`\`\`\n\`\`\`2] Количество наигранных часов на сервере.\`\`\`\n\`\`\`3] Как часто вы играете на нашем сервере?\`\`\`\n\`\`\`4] Имеется ли у вас опыт в модерировании серверов?\`\`\`\n\`\`\`5] Как скоро вы будете отвечать на анкету игрока?\`\`\`\n\`\`\`6] Оцените свою адекватность от 0 до 10.\`\`\`\n\`\`\`7] Оцените свое знание правил от 0 до 10\`\`\`\n\`\`\`8] Оцените вашу работоспособность от 0 до 10\`\`\`\n\`\`\`9] Оцените ваше знание команд (в %)\`\`\`\n\`\`\`10] Какие планы у вас на данном посте?\`\`\`\n\`\`\`11] Как вы относитесь гриферам и читерам? Были ли таким?\`\`\`\n\`\`\`12] Готовы ли вы пройти обзвон/экзамен?\`\`\`', inline: false }],
                    footer: { text: "Заявка может быть на рассмотрении до 24-х часов!" },
                    image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1075502965365936178/Thanksgiving_Blog.webp" },
                    color: 3092790,
                    timestamp: new Date(Date.now()).toISOString()
                }, components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: "Закрыть",
                        style: Discord.ButtonStyle.Secondary,
                        custom_id: "closeSupportbtn"
                    }]
                }]
            }, adminLogEmbed: {
                embed: {
                    author: { name: "Заявка на пост поддержки!" },
                    description: `${interaction.member} подал заявку на пост поддержки!`,
                    image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1074072349667762336/4e4ce889216868f6.png" },
                    color: 3092790
                }
            }
        }, client.config.Guild.channels.adminLogs);

        await supports.create({
            _id: ticketInfo.MessageInfo.id,
            ids: {
                channelID: ticketInfo.ChannelInfo.id,
                authorID: interaction.user.id
            },
            info: {
                nickname: interaction.fields.getTextInputValue("nickname"),
                age: interaction.fields.getTextInputValue("age"),
                grade: interaction.fields.getTextInputValue("grade"),
            }
        })
    }
});