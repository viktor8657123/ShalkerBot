const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const guilds = require('../database/guilds.js');

module.exports = new Modal({
    modalID: "addGuildDescriptionModal",
    async execute(client, interaction) {
        const guild = await guilds.findOne({"ids.authorID": interaction.user.id});

        guild.info.description = interaction.fields.getTextInputValue("description");
        await guild.save();

        await interaction.message.edit({components: []});

        await interaction.reply({ embeds: [{
            author: { text: "Описание было успешно установлено!" },
            description: "Нажмите на кнопку для отображения руководства!"
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Руководство",
                custom_id: "createGuildDocsbtn",
                style: 1
            }]
        }] })
    }
});