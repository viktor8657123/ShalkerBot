//Что-то для гильдий и т. д.
//by DesConnet
const Discord = require('discord.js');
const Client = require('../structure/client');
const config = require('../jsons/config.json');
const guilds = require('../database/guilds.js');

class GuildHelper {
    /**
     * Принятие заявки на создание гильдии
     * @param {Client} client Клиент
     * @param {Discord.ButtonInteraction} interaction Взаимодействие
     * @param {Boolean} isNeutral Нетральна ли гильдия
     */
    async acceptCreateGuild(client, interaction, isNeutral = false) {
        const guild = await guilds.findOne({ _id: interaction.channel.id });

        const creatorGuildRole = await interaction.guild.roles.create({
            name: `${isNeutral ? "🍀" : "⚐"} Глава ${guild.info.name}`,
            color: '#a9b5e7',
            reason: `Добавление новой гильдии ${guild.info.name}`
        });
        const memberGuildRole = await interaction.guild.roles.create({
            name: `${isNeutral ? "🍀" : "⚐"} ${guild.info.name}`,
            color: '#a9b5e7',
            reason: `Добавление новой гильдии ${guild.info.name}`
        });
    
        guild.ids.creatorRoleID = creatorGuildRole.id;
        guild.ids.memberRoleID = memberGuildRole.id;
        guild.info.neutral = isNeutral;
        guild.info.status = "Accepted"
    
        const member = await interaction.guild.members.fetch(guild.ids.authorID);
    
        member.roles.add([creatorGuildRole, memberGuildRole]);
        member.send({
            embeds: [new Discord.EmbedBuilder({
                author: { name: `${member.user.tag} ваша заявка на создание гильдии была рассмотрена.`, icon_url: member.displayAvatarURL({dynamic: true})},
                description: `Заявка на создание гильдии **${guild.info.name}** была одобрена!\nТеперь вы являетесь ${isNeutral ? "нейтральной" : "не нейтральной"} гильдией.\nДля продолжения создания гильдии необходимо добавить описание.`
            })],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    label: "Добавить описание",
                    custom_id: "addGuildDescriptionbtn",
                    style: 1
                }]
            }]
        })
    
        await guild.save();

        await client.rcon.sendRconCommands([
            `lp user ${guild.info.ownerName} parent add guild`
        ])
    }
}

module.exports = new GuildHelper();