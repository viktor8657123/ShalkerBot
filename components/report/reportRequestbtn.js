const Component = require('../../structure/component');
const Discord = require('discord.js');
const reports = require('../../database/reportRequests.js');

module.exports = new Component({
    componentID: "reportRequestbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        if (await reports.countDocuments({"ids.authorID": interaction.user.id}) >= client.config.General.maxReportCounts) return await client.dsHelper.ErrorEmbed(client, interaction, "Вы превысили лимит открытых одновременно жалоб... Куда вам еще одна?", true, true);
        const modal = new Discord.ModalBuilder({
            custom_id: "reportRequestModal",
            title: "Жалоба",
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
                    placeholder: "Пример: Player228",
                    custom_id: "reportNickname",
                    label: "Никнейм нарушителя",
                    max_length: 55,
                    min_length: 1
                }]
            }, {
                type: 1,
                components: [ {
                    type: Discord.ComponentType.TextInput,
                    style: Discord.TextInputStyle.Paragraph,
                    placeholder: "Расскажите что сделал нарушитель",
                    custom_id: "reportReason",
                    label: "Ваша жалоба",
                    max_length: 1000,
                    min_length: 1
                }]
            }]
        })

        await interaction.showModal(modal);
    }
});