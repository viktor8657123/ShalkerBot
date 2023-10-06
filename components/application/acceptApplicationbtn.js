const Component = require('../../structure/component');
const Discord = require('discord.js');
const config = require('../../jsons/config.json');
const applications = require('../../database/applications.js');

module.exports = new Component({
    componentID: "acceptApplicationbtn",
    componentType: Discord.ComponentType.Button,
    permission: "Administrator",
    acceptRoles: [config.Guild.roles.support],
    async execute(client, interaction) {
        if (!await applications.exists({ _id: interaction.message.id }))
            return client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке", true, true);

        const applicationInfo = await applications.findOne({ _id: interaction.message.id });
        const member = await interaction.guild.members.fetch(applicationInfo.ids.authorID);

        await interaction.deferReply({ fetchReply: true, ephemeral: true });

        await member.send({
            embeds: [new Discord.EmbedBuilder({
                author: { name: "ПОЗДРАВЛЯЕМ! ВЫ ПРИНЯТЫ НА СЕРВЕР!" },
                description: 'С минуты на минуту вас добавят в белый список участников.\n\n**ВЕРСИЯ СЕРВЕРА:** \`\`\`yaml\nMinecraft 1.19.x\`\`\`\n**IP-ADDRESS JAVA EDITION:** \`\`\`yaml\nplay.schalker.ru\`\`\`\`\`\`yaml\nplay.schalker.ru:25565\`\`\`\n**IP-ADDRESS BEDROCK EDITION:** \`\`\`yaml\n65.108.199.114\`\`\`\`\`\`yaml\n25767\`\`\`',
                footer: { text: "Shalker Network" },
                color: 3092790,
                image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1075468847555035226/N4xaXj9BUn8.jpg" }
            })],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    label: "КАК ЗАЙТИ?",
                    style: Discord.ButtonStyle.Link,
                    url: "https://wiki.schalker.ru/kak-nachat-igrat"
                }]
            }]
        }).then(async () => {
            await interaction.editReply({embeds: [client.MessageInfo.closeTicket.embed]});
            await member.roles.add([(await interaction.guild.roles.fetch(config.Guild.roles.player)).id])
            await member.roles.remove((await interaction.guild.roles.fetch(config.Guild.roles.user)).id)
    
            //Добавить проверку на пробелы
            await client.rcon.sendRconCommands([`temporarywhitelist:twl add ${applicationInfo.info.nickname} permanent`]);
    
            const c = interaction.guild.channels.cache.find(x => x.id == client.config.Guild.channels.applicationsLogs && x.type == Discord.ChannelType.GuildText);
            c.messages.fetch(applicationInfo.ids.adminMsgID).then(async (msg) => {
                let embed = msg.embeds[0];
                embed.data.description = `・ **Статус:** Принята\n・ **Модератор:** ${interaction.user}\n`
                embed.data.color = Discord.Colors.Green;
                await msg.edit({ embeds: [embed] })
            })
    
            await client.tickets.sendTicketLog(client, interaction, [{
                author: { name: `Логи заявки на проходку`},
                description: `Для просмотра лога скачайте его и откройте в браузере`,
                color: Discord.Colors.DarkButNotBlack
            }], `applicationsLogs-${applicationInfo.ids.authorID}`, config.Guild.channels.ticketLogs, true);
    
            await interaction.channel.delete();
    
            await applicationInfo.deleteOne();
        }).catch(async (err) => err == "DiscordAPIError[50007]: Cannot send messages to this user" ? await client.dsHelper.ErrorEmbed(client, interaction, "Не удалось отправить пользователю сообщение в ЛС\nНа это есть несколько причин:\n\n**1. У пользователя в настройках конфиденциальности на данном сервере выключен пункт \"Личные сообщения\"**\n\n**2. Пользователь заблокировал бота (Маловероятно)**",true, true) : await client.dsHelper.ErrorEmbed(client, interaction, err, true, true))
    }
});