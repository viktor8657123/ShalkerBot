const Component = require('../../structure/component');
const Discord = require('discord.js');
const builds = require('../../database/builds.js');

module.exports = new Component({
    componentID: "buildRequestbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (await builds.exists({"ids.authorID": interaction.user.id})) return await client.dsHelper.ErrorEmbed(client, interaction, "Вы уже подали заявку на постройку... Куда вам еще одна?", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "buildRequestModal",
            title: "Заявка на постройку",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: revense",
                    required: true,
                    label: "Ваш игровой никнейм",
                    custom_id: "nickname",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Распишите вашу идею",
                    custom_id: "idea",
                    label: "Идея постройки",
                    max_length: 1000,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: 10000 часов",
                    custom_id: "playingHours",
                    label: "Сколько у вас наиграно часов?",
                    max_length: 1000,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});