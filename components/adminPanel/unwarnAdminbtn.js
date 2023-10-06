const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "unwarnAdminbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const modal = new Discord.ModalBuilder({
            custom_id: "unwarnAdminModal",
            title: "Снятие предупреждения",
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
            }]
        })

        await interaction.showModal(modal);
    }
});