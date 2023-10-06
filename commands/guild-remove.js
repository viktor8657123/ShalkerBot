const Command = require('../structure/command.js');
const Discord = require('discord.js');
const config = require('../jsons/config.json');
const guilds = require('../database/guilds.js');


module.exports = new Command({
    name: "guild-remove",
    description: "Удаление гильдии",
    slashCommandOptions: [{
        name: "role",
        description: "Любая роль гильдии",
        type: Discord.ApplicationCommandOptionType.Role,
        required: true
    }],
    permissions: [Discord.PermissionFlagsBits.ManageChannels],
    async execute(client, args, interaction) {
        const rID = args.getRole("role").id;
        const guild = await guilds.findOne({$or: [{"ids.creatorRoleID": rID } , {"ids.memberRoleID": rID}]});
        if (!guild) return await client.dsHelper.ErrorEmbed(client, interaction, "Гильдии с данной ролью небыло найдено в базе данных!", true);

        [guild.ids.creatorRoleID, guild.ids.memberRoleID].forEach(async (roleID) => {
            (await interaction.guild.roles.fetch(roleID)).delete();
        })

        await interaction.reply({content: `Гильдия ${guild.info.name} была успешно удалена!`, ephemeral: true});
        guild.deleteOne();
    }
});