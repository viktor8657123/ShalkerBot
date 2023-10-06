const Component = require('../../structure/component');
const Discord = require('discord.js');
const prezidents = require('../../database/prezidents');

module.exports = new Component({
    componentID: "prezidentRequestbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (await prezidents.exists({"ids.authorID": interaction.user.id})) return await client.dsHelper.ErrorEmbed(client, interaction, "Вы уже подали заявку на пост президента... Куда вам еще одна?", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "prezidentRequestModal",
            title: "Заявка на президента",
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
                    placeholder: "Можешь написать здесь все что угодно...",
                    custom_id: "aboutYou",
                    label: "Расскажи немного о себе.",
                    max_length: 1000,
                    min_length: 55
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});