const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');

module.exports = new Command({
    name: "tempban",
    description: "Временно забанить игрока",
    slashCommandOptions: [{
        name: "nickname",
        description: "Ник игрока",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }, {
        name: "time",
        description: "Время предупреждения",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }, {
        name: "type",
        description: "На сколько [Дни, Часы, Минуты]",
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
        choices: [
            {name: "Дни", value: "d"},
            {name: "Часы", value: "h"},
            {name: "Минуты", value: "m"}
        ]
    }, {
        name: "reason",
        description: "Причина бана",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        await client.rcon.sendRconCommands([`litebans:tempban ${args.getString("nickname")} ${args.getString("time")}${args.getString("type")} ${args.getString("reason")}`]);
        await interaction.reply({content: 'Done!', ephemeral: true})
    }
});