const Component = require('../../structure/component');
const Discord = require('discord.js');
const supports = require('../../database/supports.js');

module.exports = new Component({
    componentID: "supportRequestbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (await supports.exists({"ids.authorID": interaction.user.id})) return await client.dsHelper.ErrorEmbed(client, interaction, "Вы уже подали заявку на пост поддержки... Куда вам еще одна?", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "supportRequestModal",
            title: "Заявка на пост поддержки.",
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
                    style: Discord.TextInputStyle.Short,
                    placeholder: "Пример: 16 лет",
                    custom_id: "age",
                    label: "Сколько вам лет?",
                    max_length: 10,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Short,
                    placeholder: "От 1 до 10",
                    custom_id: "grade",
                    label: "Дайте оценку своих знаний указанных критерий",
                    max_length: 2,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});