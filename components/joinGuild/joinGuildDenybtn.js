const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const joinGuilds = require('../../database/joinGuilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "joinGuildDenybtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const joinGuild = await joinGuilds.findOne({"ids.channelID": interaction.channel.id})
        const guild = await guilds.findOne({_id: joinGuild.ids.guildID});
        
        if(interaction.user.id != guild.ids.authorID) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true);

        const modal = new Discord.ModalBuilder({
            custom_id: "joinGuildDenyModal",
            title: "Отклонить заявку",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Напиши почему игрок вам не подошел...",
                    required: true,
                    label: "Причина отклонения",
                    custom_id: "reasonDeny",
                    max_length: 200,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});