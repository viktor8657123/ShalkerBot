const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "guild",
    description: "Команды гильдии",
    permissions: [Discord.PermissionFlagsBits.SendMessages]
});