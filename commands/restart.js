const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "restart",
    description: "Перезапуск бота",
    slashCommandOptions: [],
    permissions: [Discord.PermissionFlagsBits.Administrator],
    async execute(client, args, interaction) {
        await interaction.reply({content: "Done!", ephemeral: true});
        process.exit(0);
    }
});