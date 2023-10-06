const Event = require('../structure/event.js');
const config = require('../jsons/config.json');
const Discord = require('discord.js');

module.exports = new Event('voiceStateUpdate', async (client, oldState, newState) => {
    const channelVoice = config.Guild.channels.createTempVoice;
    const categoryVoice = config.Guild.categories.tempVoiceCategory;
    var everyoneRole = oldState.guild.id

    if (newState.channel?.id == channelVoice) {
        await newState.guild.channels.create({
            name: `▸   [ ${newState.member.user.username} ]`,
            type: Discord.ChannelType.GuildVoice,
            parent: categoryVoice,
            permissionOverwrites: [{
                id: newState.member.id,
                allow: [Discord.PermissionFlagsBits.ManageChannels]
            }, {
                id: everyoneRole,
                allow: [Discord.PermissionFlagsBits.ViewChannel],
                deny: [Discord.PermissionFlagsBits.ManageChannels]
            }]
        }).then(channel => {
            newState.setChannel(channel)
        })
    }
    if (oldState.channel?.id != channelVoice && oldState.channel?.parent == categoryVoice && !oldState.channel.members.size && oldState.channel?.type == Discord.ChannelType.GuildVoice) {
        oldState.channel.delete()
    }
})