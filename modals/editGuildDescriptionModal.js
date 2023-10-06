const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const guilds = require('../database/guilds.js');

module.exports = new Modal({
    modalID: "editGuildDescriptionModal",
    async execute(client, interaction) {
        const guild = await guilds.findOne({ "ids.authorID": interaction.user.id });
        if (!guild) return await client.dsHelper.ErrorEmbed(client, interaction, "У вас нет гильдии которую вы создали", true);

        guild.info.description = interaction.fields.getTextInputValue("description");
        await guild.save();

        await interaction.message.edit({ components: [] });

        await interaction.reply({
            embeds: [{
                author: { text: "Описание было успешно изменено!" },
            }]
        })
    }
});