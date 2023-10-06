const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Command({
    name: "unwarn",
    description: "Снять с игрока предупреждение",
    slashCommandOptions: [{
        name: "nickname",
        description: "Ник игрока",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        await client.rcon.sendRconCommands([`litebans:unwarn ${args.getString("nickname")}`]);
        await interaction.reply({content: 'Done!', ephemeral: true})
    }
});