const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "warnAdminModal",
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const reason = interaction.fields.getTextInputValue('reason');
        const user = interaction.fields.getTextInputValue('nickname');

        await client.rcon.sendRconCommands([`litebans:warn ${user} ${reason}`]);
        await interaction.reply({content: `Игроку ${user} было вынесено предупреждение по причине ${reason}`, ephemeral: true});
    }
});