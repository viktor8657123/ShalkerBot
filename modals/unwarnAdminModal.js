const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "unwarnAdminModal",
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        const user = interaction.fields.getTextInputValue('nickname');

        await client.rcon.sendRconCommands([`litebans:unwarn ${user}`]);
        await interaction.reply({content: `C игрока ${user} было снято предупреждение`, ephemeral: true});
    }
});