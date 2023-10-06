const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');
const guilds = require('../database/guilds.js');


module.exports = new Command({
    name: "guild-add",
    description: "Добавление существующей гильдии в базу данных",
    slashCommandOptions: [{
        name: "name",
        description: "Имя гильдии",
        type: Discord.ApplicationCommandOptionType.String,
        required: true
    }, {
        name: "guild-owner",
        description: "Основатель гильдии",
        type: Discord.ApplicationCommandOptionType.User,
        required: true
    }, {
        name: "symbol",
        description: "Символ гильдии",
        type: Discord.ApplicationCommandOptionType.String,
        maxLength: 1,
        required: true
    }, {
        name: "neutral",
        description: "Нейтральная ли гильдия",
        type: Discord.ApplicationCommandOptionType.Boolean,
        required: true
    }, {
        name: "owner-role",
        description: "Роль главы гильдии",
        type: Discord.ApplicationCommandOptionType.Role,
        required: true
    }, {
        name: "member-role",
        description: "Роль участника гильдии",
        type: Discord.ApplicationCommandOptionType.Role,
        required: true
    }, {
        name: "description",
        description: "Описание гильдии",
        type: Discord.ApplicationCommandOptionType.String,
        required: false
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        const guildOwner = await interaction.guild.members.fetch(args.getUser("guild-owner").id);
        const name = args.getString("name");
        const ownerRole = args.getRole("owner-role");
        const memberRole = args.getRole("member-role");
        if (await guilds.exists({$or: [{"info.name": name}, {"info.ownerName": guildOwner.displayName}, {"ids.creatorRoleID": ownerRole.id}, {"ids.memberRoleID": memberRole.id}, {"ids.authorID": guildOwner.id}]})) return await client.dsHelper.ErrorEmbed(client, interaction, "Один из указаных параметров уже есть в базе данных, операция отменена...", true);

        await guilds.create({
            _id: interaction.id,
            ids: {
                authorID: guildOwner.id,
                creatorRoleID: ownerRole.id,
                memberRoleID: memberRole.id
            },
            info: {
                name: name,
                description: args.getString("description", false) ?? null,
                symbol: args.getString("symbol"),
                neutral: args.getBoolean("neutral"),
                ownerName: guildOwner.displayName,
                status: "Accepted"
            }
        })

        await interaction.reply({ content: `Гильдия ${name} была успешно добавлена в базу данных`, ephemeral: true });
    }
});