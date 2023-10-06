const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "whitelistAdminModal",
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const action = interaction.fields.getTextInputValue('action');
        const user = interaction.fields.getTextInputValue('nickname');

        if (!["remove", "add"].some(x => x == action)) return client.dsHelper.ErrorEmbed(client, interaction, "Выбрано неправильное действие (Доступно: remove, add)", true, true);
        await client.rcon.sendRconCommands([`temporarywhitelist:twl ${action} ${user} ${action == "add" ? "permanent" : ""}`]);
        await interaction.reply({content: action == "add" ? `Игрок ${user} был успешно добавлен в белый список` : `Игрок ${user} был удален из белого списка`, ephemeral: true});
    }
});