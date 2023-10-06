const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const applications = require('../database/applications.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "closeReasonTicketModal",
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        if (!await applications.exists({ _id: interaction.message.id }))
            return client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке", true, true);

        const applicationInfo = await applications.findOne({ _id: interaction.message.id });
        const member = await interaction.guild.members.fetch(applicationInfo.ids.authorID);

        member.send({
            embeds: [new Discord.EmbedBuilder({
                author: { name: "Ваша заявка была отклонена!" },
                description: interaction.fields.getTextInputValue("reasonDeny") == "" ? "Вашу заявку отклонили без указания точной причины!" : `Вашу заявку отклонили по причине: \`${interaction.fields.getTextInputValue("reasonDeny")}\``,
                footer: { text: "Shalker Network" }
            })]
        }).catch(async (err) => err == "DiscordAPIError[50007]: Cannot send messages to this user" ? await client.dsHelper.ErrorEmbed(client, interaction, "Не удалось отправить пользователю сообщение в ЛС\nНа это есть несколько причин:\n\n**1. У пользователя в настройках конфиденциальности на данном сервере выключен пункт \"Личные сообщения\"**\n\n**2. Пользователь заблокировал бота (Маловероятно)**",false, true, false, true) : await client.dshelper.ErrorEmbed(client, interaction, err, false, true, false, true));

        await interaction.channel.delete();

        const c = interaction.guild.channels.cache.find(x => x.id == client.config.Guild.channels.applicationsLogs && x.type == Discord.ChannelType.GuildText);
        c.messages.fetch(applicationInfo.ids.adminMsgID).then(async (msg) => {
            let embed = msg.embeds[0];
            embed.data.description = `・ **Статус:** Отклонена\n・ **Модератор:** ${interaction.user}\n・ **Причина:** \`${interaction.fields.getTextInputValue("reasonDeny") == "" ? "Отсутствует" : interaction.fields.getTextInputValue("reasonDeny")}\``
            embed.data.color = Discord.Colors.Red;
            await msg.edit({ embeds: [embed] })
        })

        await client.tickets.sendTicketLog(client, interaction, [{
            author: { name: `Логи заявки на проходку`},
            description: `Для просмотра лога скачайте его и откройте в браузере`,
            color: Discord.Colors.DarkButNotBlack
        }], `applicationsLogs-${m.ids.authorID}`, config.Guild.channels.ticketLogs);

        applicationInfo.deleteOne(); 
    }
});