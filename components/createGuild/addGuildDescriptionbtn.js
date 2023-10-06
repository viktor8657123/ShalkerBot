const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');

module.exports = new Component({
    componentID: "addGuildDescriptionbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const modal = new Discord.ModalBuilder({
            custom_id: "addGuildDescriptionModal",
            title: "Добавить описание",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Можешь написать все что угодно!",
                    required: true,
                    label: "Описание гильдии",
                    custom_id: "description",
                    max_length: 200,
                    min_length: 20
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});