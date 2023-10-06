const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "whitelistAdminbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const modal = new Discord.ModalBuilder({
            custom_id: "whitelistAdminModal",
            title: "Белый список",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: Player228",
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
                    placeholder: "remove / add",
                    custom_id: "action",
                    required: true,
                    label: "Действие",
                    max_length: 6,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});