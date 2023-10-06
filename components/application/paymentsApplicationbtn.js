const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');
const applications = require('../../database/applications.js');

module.exports = new Component({
    componentID: "paymentsApplicationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        await interaction.reply({ content: `||${await interaction.guild.members.fetch((await applications.findOne({ _id: interaction.message.id })).ids.authorID)}||`,
            embeds: [new Discord.EmbedBuilder({
                title: "**ВАША АНКЕТА ОДОБРЕНА!**",
                description: "Насладитесь геймплеем играя на Schalker Network!\nЧтобы попасть на сервер, нужно оплатить проходку.\nСтоимость проходки: `100 рублей`",
                color: 3092790,
                image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1075464543473516564/IREzfkhnGvo.jpg" },
                footer: { text: "После оплаты, предоставьте пожалуйста скриншот с чеком транзакции." }
            })], components: [{
                type: 1,
                components: [{
                    type: 2,
                    label: "SCHALKER.RU",
                    style: Discord.ButtonStyle.Link,
                    url: "https://schalker.ru/"
                }, {
                    type: 2,
                    label: "DONATIONALERTS",
                    style: Discord.ButtonStyle.Link,
                    url: "https://www.donationalerts.com/r/schalker_dens"
                }, {
                    type: 2,
                    label: "QIWI",
                    style: Discord.ButtonStyle.Link,
                    url: "https://qiwi.com/payment/form/99999?extra[%27accountType%27]=nickname&extra[%27account%27]=SCHALKER"
                }, {
                    type: 2,
                    label: "YOOMONEY",
                    style: Discord.ButtonStyle.Link,
                    url: "https://yoomoney.ru/to/410012610639627"
                }]
            }]
        });
    }
});