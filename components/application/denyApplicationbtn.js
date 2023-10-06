const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "denyApplicationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const modal = new Discord.ModalBuilder({
            custom_id: "denyApplicationModal",
            title: "Отклонить заявку",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Укажите причину отклонения заявки или оставьте это поле пустым",
                    required: false,
                    label: "Причина отклонения",
                    custom_id: "reasonDeny",
                    max_length: 1000,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});