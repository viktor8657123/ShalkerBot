const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const guilds = require('../database/guilds.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "createGuildModal",
    permission: "SendMessages",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        if (!["да", "нет"].some(x => x == interaction.fields.getTextInputValue("neutralGuild").toLowerCase())) return await client.dsHelper.ErrorEmbed(client, interaction, "Это не ответ! [Поле: Нейтральна ли гильдия, Доступные варианты: Да, Нет]", true, true);
        if (isNaN(interaction.fields.getTextInputValue("countMembersGuild")) || +interaction.fields.getTextInputValue("countMembersGuild") <= 5) return await client.dsHelper.ErrorEmbed(client, interaction, "Это не ответ! [Поле: Количество участников гильдии, Доступные варианты: Положительное число (Начиная с 5)]", true, true);
        const ticketInfo = await client.tickets.createTicket(interaction, client.config.Guild.categories.guildCategory, {
            channelName: `┃${interaction.user.username}`,
            topic: `Заявка на создание гильдии ${interaction.fields.getTextInputValue("guildName")}`
        }, {replyEmbed: {ephemeral: true, embed: {
            author: { name: "Создание гильдии" },
            description: `Вы успешно подали заявку на создание гильдии.`,
            color: 3092790
        }}, ticketChannelEmbed: {embed: {
            title: `**СОЗДАНИЕ ГИЛЬДИИ**`,
            description: `Вам необходимо сделать следущее: \`\`\`● Добавить участников используя команду /add_user\`\`\` \`\`\`● Сделать слоган и полное описание вашей гильдии.\`\`\` \n\n`,
            fields: [{
                name: "Название гильдии:",
                value: `\`${interaction.fields.getTextInputValue("guildName")}\``,
                inline: true
            }, {
                name: "Символ гильдии:",
                value: `\`${interaction.fields.getTextInputValue("symbolGuild")}\``,
                inline: true
            }, {
                name: "Глава гильдии:",
                value: `\`${interaction.fields.getTextInputValue("creatorGuildName")}\``,
                inline: true
            }, {
                name: "Кол-во участников гильдии:",
                value: `\`${interaction.fields.getTextInputValue("countMembersGuild")}\``,
                inline: true
            }, {
                name: "Нейтральна ли гильдия?:",
                value: `\`${interaction.fields.getTextInputValue("neutralGuild")}\``,
                inline: true
            }],
            image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1024553045989797908/CXBbXxihPaI.jpg"},
            color: 3092790,
            footer: { text: "Заявка рассматривается в течении нескольких дней!" }
        }, components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Закрыть",
                style: Discord.ButtonStyle.Secondary,
                custom_id: "closeCreateGuildbtn" 
            }, {
                type: 2,
                label: "[⚐] Одобрено",
                style: Discord.ButtonStyle.Danger,
                custom_id: "acceptCreateGuildbtn" 
            }, {
                type: 2,
                label: "[🍀] Одобрено",
                style: Discord.ButtonStyle.Success,
                custom_id: "acceptCreateNeutralGuildbtn" 
            }]
        }]}, adminLogEmbed: {
            embed: {
                author: { name: "Создание гильдии!" },
                description: `${interaction.member} подал заявку на создание гильдии!`,
                image: {url: "https://cdn.discordapp.com/attachments/621792624621256704/1074072367371915344/7e9eb59d5829ac07.png"},
                color: 3092790
            }
        }}, client.config.Guild.channels.adminLogs);

        await guilds.create({
            _id: ticketInfo.ChannelInfo.id,
            ids: {
                authorID: interaction.user.id, 
            },
            info: {
                name: interaction.fields.getTextInputValue("guildName"),
                symbol: interaction.fields.getTextInputValue("symbolGuild"),
                ownerName: interaction.fields.getTextInputValue("creatorGuildName"),
                status: "Сonsideration"
            }
        })
    }
});