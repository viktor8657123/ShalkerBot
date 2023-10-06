const Command = require('../structure/command.js');
const Discord = require('discord.js');

module.exports = new Command({
    name: "spawn_message",
    description: "Генерирует анкету заданного типа.",
    slashCommandOptions: [{
        name: "type",
        description: "Тип анкеты которую вы хотите сгенерировать",
        type: Discord.ApplicationCommandOptionType.String,
        required: true,
        choices: [
            { name: 'Проходка', value: 'application' },
            { name: 'Создать ГИ', value: 'createGuild' },
            { name: 'Вступить ГИ', value: 'joinGuild' },
            { name: 'Жалоба', value: 'report' },
            { name: 'Постройка', value: 'build' },
            { name: 'Поддержка', value: 'support' },
            { name: 'Президент', value: 'prezident' },
            { name: 'Панель управления', value: 'admin_panel' },
        ]
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        const EmbedBuild = new Discord.EmbedBuilder(client.MessageInfo[args.getString("type")].embed);
        const actionRow = Discord.ActionRowBuilder.from({type: 1, components: client.MessageInfo[args.getString("type")].components});

        await interaction.reply({content: "Done!", ephemeral: true});
        await interaction.channel.send({embeds: [EmbedBuild], components: [actionRow]});
    }
});