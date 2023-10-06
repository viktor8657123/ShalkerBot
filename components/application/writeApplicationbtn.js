const Component = require('../../structure/component');
const Discord = require('discord.js');
const applications = require('../../database/applications');

module.exports = new Component({
    componentID: "writeApplicationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (await applications.exists({ "ids.authorID": interaction.user.id, "info.status": "Рассматривается" }))
            return await client.dsHelper.ErrorEmbed(client, interaction, "Вы уже подали заявку которая рассматривается, пожалуйста дождитесь пока её рассмотрят.", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "applicationModal",
            title: "Заявка на проходку",
            components: [{
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: Player228",
                    required: true,
                    label: "Ваш игровой никнейм",
                    custom_id: "nickname",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Откуда или от кого узнали о проекте? [Никнейм]",
                    custom_id: "reasonApplication",
                    label: "Почему вы выбрали нас?",
                    max_length: 100,
                    min_length: 1,
                    required: false
                }]
            }, {
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Ваши планы и т.д.",
                    custom_id: "plans",
                    label: "Расскажите что хотите делать на проекте?",
                    max_length: 1000,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Читали? Признавайтесь!",
                    custom_id: "readRules",
                    label: "Прочитали ли вы правила?",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [{
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Чем увлекаешся, какие у тебя есть хобби?",
                    custom_id: "aboutYou",
                    label: "Расскажите немного о себе",
                    max_length: 100,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});