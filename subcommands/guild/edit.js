const Subcommand = require('../../structure/subcommand.js');
const guilds = require('../../database/guilds');
const Discord = require('discord.js');

module.exports = new Subcommand({
    name: "edit",
    description: "Редактирование гильдии",
    subCommandOptions: [],
    permissions: [],
    async execute(client, args, interaction) {
        const guild = await guilds.findOne({"ids.authorID": interaction.user.id});
        if (!guild) return await client.dsHelper.ErrorEmbed(client, interaction, "У вас нет гильдии которую вы создали", true);

        const modal = new Discord.ModalBuilder({
            custom_id: "editGuildDescriptionModal",
            title: "Изменение описания",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Описание отсутствует... Напиши что-то сюда",
                    required: true,
                    label: "Ваше описание гильдии",
                    value: guild.info.description ?? "",
                    custom_id: "guildDescription",
                    max_length: 200,
                    min_length: 0
                }]
            }]
        })

        await interaction.showModal(modal);
    }
})