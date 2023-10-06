const Subcommand = require('../../structure/subcommand.js');
const guilds = require('../../database/guilds.js');

module.exports = new Subcommand({
    name: "leave",
    description: "Покинуть гильдию",
    subCommandOptions: [],
    permissions: [],
    async execute(client, args, interaction) {
        const guild = await guilds.findOne({$or: interaction.member.roles.cache.map(role => ({"ids.memberRoleID": role.id}))});

        if (!guild) return client.dsHelper.ErrorEmbed(client, interaction, "Вы не состоите ни в одной гильдии", true);
        if (interaction.user.id == guild.ids.authorID) return client.dsHelper.ErrorEmbed(client, interaction, "Создатель гильдии не может покинуть её.", true);

        await interaction.member.roles.remove(guild.ids.memberRoleID);

        await interaction.reply({ content: `Вы успешно покинули гильдию ${guild.info.name}`, ephemeral: true });
    }
})