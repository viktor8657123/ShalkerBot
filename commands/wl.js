const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Command({
    name: "wl",
    description: "Управление вайтлистом",
    slashCommandOptions: [{
        name: "nickname",
        description: "Ник игрока",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }, {
        name: "action",
        description: "Действие",
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
        choices: [
            { name: "Добавить в белый список (Whitelist)", value: "add" },
            { name: "Убрать из белого списка (Whitelist)", value: "remove" }
        ]
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        const action = args.getString("action");
        await client.rcon.sendRconCommands([`temporarywhitelist:twl ${action} ${args.getString("nickname")} ${action == "add" ? "permanent" : ""}`]);
        await interaction.reply({ content: 'Done!', ephemeral: true })
    }
});