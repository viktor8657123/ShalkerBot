const Command = require('../structure/command.js');
const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = new Command({
    name: "add-ticket",
    description: "Добавляет игрока в анкету",
    slashCommandOptions: [{
        name: "user",
        description: "Пользователь которого хотите добавить",
        type: Discord.ApplicationCommandOptionType.User,
        required: true
    }],
    permissions: [Discord.PermissionFlagsBits.SendMessages],
    async execute(client, args, interaction) {  
        const category = client.config.Guild.categories; 
        if (args.getUser("user").bot) return client.dsHelper.ErrorEmbed(client, interaction, "Нельзя добавить бота в тикет!");
        if (![category.applicationCategory, category.reportCategory, category.guildCategory].some(x => interaction.channel.parentId == x)) return client.dsHelper.ErrorEmbed(client, interaction, "Упс... В данной категории эта команда недоступна.", true);
        await interaction.channel.permissionOverwrites.edit(args.getUser("user"), {
            SendMessages: true,
            ViewChannel: true
        })
        await interaction.reply({ embeds: [{
            description: `Пользователь ${args.getUser("user")} был добавлен в тикет!`,
            color: Discord.Colors.Green
        }]})
    }
});