const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "warnAdminbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const modal = new Discord.ModalBuilder({
            custom_id: "warnAdminModal",
            title: "Предупреждение",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: revense",
                    required: true,
                    label: "Игровой никнейм",
                    custom_id: "nickname",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Номер правила",
                    custom_id: "reason",
                    label: "Причина",
                    max_length: 1000,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});