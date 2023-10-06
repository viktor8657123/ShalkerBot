const Component = require('../../structure/component');
const Discord = require('discord.js');
const joinGuilds = require('../../database/joinGuilds');
const guilds = require('../../database/guilds');

module.exports = new Component({
    componentID: "joinGuildbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const guild = await guilds.findOne({$or: interaction.member.roles.cache.map(role => ({"ids.memberRoleID": role.id}))});

        if (guild) return client.dsHelper.ErrorEmbed(client, interaction, "Вы уже состоите в одной из гильдии", true);
        if (await joinGuilds.exists({"ids.authorID": interaction.user.id})) return await client.dsHelper.ErrorEmbed(client, interaction, "Вы уже подали заявку на вступление в гильдию... Куда вам еще одна?", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "joinGuildModal",
            title: "Вступление в гильдию",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: revense",
                    required: true,
                    label: "Ваш игровой никнейм",
                    custom_id: "nickname",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: Да/Несовсем/Нет",
                    custom_id: "activity",
                    label: "Активный ли вы игрок?",
                    max_length: 10,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Можешь написать здесь все что угодно...",
                    custom_id: "aboutYou",
                    label: "Расскажи немного о себе.",
                    max_length: 1000,
                    min_length: 55
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});