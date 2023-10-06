const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const joinGuilds = require('../../database/joinGuilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "joinGuildAcceptbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const joinGuild = await joinGuilds.findOne({"ids.channelID": interaction.channel.id})
        const guild = await guilds.findOne({_id: joinGuild.ids.guildID});
        
        if(interaction.user.id != guild.ids.authorID) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true);

        const member = await interaction.guild.members.fetch(joinGuild.ids.authorID);
        await member.roles.add(await interaction.guild.roles.fetch(guild.ids.memberRoleID));

        member.send({ embeds: [{
            author: { name: `${member.user.tag} ваша заявка на вступление в гильдию была рассмотрена.`, icon_url: member.displayAvatarURL({dynamic: true})},
            description: `Глава гильдии **${guild.info.name}** одобрил вашу заявку на вступление!\nТеперь вы являетесь участником ${guild.info.name} гильдией.`
        }] })

        await client.tickets.sendTicketLog(client, interaction, [{
            author: { name: `Логи заявки на вступление в гильдию от игрока ${joinGuild.info.nickname}`},
            description: `・ **Закрыл заявку:** ${interaction.user}`,
            footer: { text: "Для просмотра лога скачайте его и откройте в браузере"},
            color: Discord.Colors.DarkButNotBlack
        }], `joinGuildLogs-${joinGuild.ids.authorID}`, config.Guild.channels.ticketLogs);
        
        await interaction.channel.delete();
        await joinGuild.deleteOne();
    }
});