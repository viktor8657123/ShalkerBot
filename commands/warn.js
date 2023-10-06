const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Command({
    name: "warn",
    description: "Выдать игроку предупреждение",
    slashCommandOptions: [{
        name: "nickname",
        description: "Ник игрока",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }, {
        name: "reason",
        description: "Причина предупреждения",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        await client.rcon.sendRconCommands([`litebans:warn ${args.getString("nickname")} ${args.getString("reason")}`]);
        await interaction.reply({content: 'Done!', ephemeral: true})
    }
});