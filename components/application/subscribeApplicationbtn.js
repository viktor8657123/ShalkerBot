const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');
const applications = require('../../database/applications.js');

module.exports = new Component({
    componentID: "subscribeApplicationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        await interaction.reply({ content: `||${await interaction.guild.members.fetch((await applications.findOne({ _id: interaction.message.id })).ids.authorID)}||`,
            embeds: [new Discord.EmbedBuilder({
                title: "**БЕСПЛАТНАЯ ПРОХОДКА**",
                description: "Чтобы зайти на сервер по бесплатной проходке, вам необходимо подписаться на указанные социальные сети.\n",
                color: 3092790,
                image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1024413564385108098/EFyvzFrz1A.png" },
                footer: { text: "Вы обязаны показать скриншот подписки каждой соц. сети!" }
            })], components: [{
                type: 1,
                components: [{
                    type: 2,
                    label: "VK-OFFICIAL",
                    style: Discord.ButtonStyle.Link,
                    url: "https://vk.com/schalkervanilla"
                }, {
                    type: 2,
                    label: "SCHALKER STUDIO",
                    style: Discord.ButtonStyle.Link,
                    url: "https://www.youtube.com/channel/UCTrRumYGgU7KWLXtimHYaBw"
                }, {
                    type: 2,
                    label: "BOXSTUDIO",
                    style: Discord.ButtonStyle.Link,
                    url: "https://vk.com/boxbuild"
                }]
            }]
        });
    }
});