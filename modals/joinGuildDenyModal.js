const Modal = require('../structure/modal.js');
const Discord = require('discord.js');
const guilds = require('../database/guilds.js');
const joinGuilds = require('../database/joinGuilds.js');
const config = require('../jsons/config.json');

module.exports = new Modal({
    modalID: "joinGuildDenyModal",
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const joinGuild = await joinGuilds.findOne({"ids.channelID": interaction.channel.id})
        const guild = await guilds.findOne({_id: joinGuild.ids.guildID});
        
        if(interaction.user.id != guild.ids.authorID) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true);

        const member = await interaction.guild.members.fetch(joinGuild.ids.authorID);
        await member.roles.add(await interaction.guild.roles.fetch(guild.ids.memberRoleID));

        member.send({ embeds: [{
            author: { name: `${member.user.tag} ваша заявка на вступление в гильдию ${guild.info.name} была рассмотрена.`, icon_url: member.displayAvatarURL({dynamic: true})},
            description: `Глава гильдии **${guild.info.name}** отклонил вашу заявку на вступление по причине \`${interaction.fields.getTextInputValue("reasonDeny")}\``
        }] })

        await client.tickets.sendTicketLog(client, interaction, {
            content: `Логи вступления в гильдию от игрока ${joinGuild.info.nickname}`
        }, `joinGuildLogs-${joinGuild.ids.authorID}`, config.Guild.channels.ticketLogs);
        await interaction.channel.delete();

        await interaction.deferUpdate();
        await joinGuild.deleteOne();
    }
});