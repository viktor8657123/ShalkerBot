const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "tempbanAdminModal",
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const reason = interaction.fields.getTextInputValue('reason');
        const time = interaction.fields.getTextInputValue('time');
        const user = interaction.fields.getTextInputValue('nickname');

        if (!RegExp(/^[0-9]+[dhm]$/).test(time)) return client.dsHelper.ErrorEmbed(client, interaction, "Неверно указано время", true, true)
        await client.rcon.sendRconCommands([`litebans:tempban ${user} ${time} ${reason}`]);
        await interaction.reply({content: `Игрок ${user} был временно забанен по причине ${reason}`, ephemeral: true});
    }
});