const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');

module.exports = new Component({
    componentID: "createGuildbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const guild = await guilds.findOne({$or: interaction.member.roles.cache.map(role => ({"ids.memberRoleID": role.id}))});
        if (guild) return client.dsHelper.ErrorEmbed(client, interaction, "Вы уже состоите в одной из гильдии", true);

        if (await guilds.exists({"ids.authorID": interaction.user.id})) return await client.dsHelper.ErrorEmbed(client, interaction, "Вы уже создали гильдию... Куда вам еще одна?", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "createGuildModal",
            title: "Создание гильдии",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: Submarine",
                    required: true,
                    label: "Название гильдии",
                    custom_id: "guildName",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "★",
                    required: false,
                    custom_id: "symbolGuild",
                    label: "Символ гильдии (UTF-8)",
                    max_length: 1,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: Watson",
                    custom_id: "creatorGuildName",
                    required: true,
                    label: "Игровой никнейм главы гильдии",
                    max_length: 40,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Минимум 5 человек",
                    custom_id: "countMembersGuild",
                    required: true,
                    label: "Количество участников гильдии",
                    max_length: 3,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Да/Нет",
                    custom_id: "neutralGuild",
                    required: true,
                    label: "Нейтральная ли гильдия?",
                    max_length: 3,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});