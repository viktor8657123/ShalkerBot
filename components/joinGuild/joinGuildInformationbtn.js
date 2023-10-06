const Component = require('../../structure/component');
const Discord = require('discord.js');
const guilds = require('../../database/guilds.js');
const config = require('../../jsons/config.json');

module.exports = new Component({
    componentID: "joinGuildInformationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "SendMessages",
    acceptRoles: [],
    async execute(client, interaction) {
        const allGuilds = await guilds.find({});
        if (allGuilds.length <= 25) {
            await interaction.reply({
                content: `Выбери одну из гильдий`, components: [new Discord.ActionRowBuilder().addComponents([new Discord.StringSelectMenuComponent({
                        placeholder: "Выбрать можешь тут...",
                        options: allGuilds.filter(filter => (filter.info.status ?? "Accepted") != "Сonsideration").map((guild) => {return {label: guild.info.name, value: `${guild._id}`, description: guild.info?.description?.slice(0,100) ?? "Описание отсутствует..."}}),
                        type: Discord.ComponentType.StringSelect,
                        custom_id: "joinGuildInformationMenu"
                })
                ])],
                ephemeral: true
            })
        }

        // const maps = allGuilds.map((guild) => {return {label: guild.info.name, value: `${guild._id}`, description: guild.info.description ?? "Описание отсутствует..."}})
        // console.log(maps);
        // const testMenu = new Discord.StringSelectMenuComponent({
        //     placeholder: "test",
        //     options: maps,
        //     type: Discord.ComponentType.StringSelect,
        //     custom_id: "TestMenu"
        // });
        // await interaction.reply({content: "test!", components: [new Discord.ActionRowBuilder().addComponents([testMenu])], ephermal: true})
    }
});