//Что-то для тикетов и т. д.
//by DesConnet
const Discord = require('discord.js');
const Client = require('../structure/client');
const config = require('../jsons/config.json');
const transcript = require('discord-html-transcripts');
const mongoose = require('mongoose');

class TicketHelper {
    /**
     * Создание тикета
     * @typedef {{channelName: string, topic: string, permissonOverwrites: Discord.OverwriteResolvable[]}} ChannelInfo
     * @typedef {{embed: Discord.APIEmbed, components: Discord.APIActionRowComponent[]}} msgData
     * @typedef {{replyEmbed: {ephemeral: boolean, embed: Discord.APIEmbed}, ticketChannelEmbed: msgData, adminLogEmbed: msgData}} MessagesInfo
     * @param {Discord.ModalSubmitInteraction} interaction => Interaction
     * @param {string} categoryID => ID категории куда создатся канал
     * @param {ChannelInfo} channelInfo => Информация о канале
     * @param {MessagesInfo} messages => Сообщения
     * @param {string} logChannelID => Админский канал куда отправится лог
     * @returns Кое какую инфу
     */
    async createTicket(interaction, categoryID, channelInfo, messages, logChannelID) {
        const channel = await interaction.guild.channels.create({
            name: channelInfo.channelName,
            type: Discord.ChannelType.GuildText,
            topic: channelInfo.topic,
            permissionOverwrites: channelInfo.permissonOverwrites ?? [
                {
                    id: interaction.member.id,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.guild.id,
                    deny: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: config.Guild.roles.player,
                    deny: [Discord.PermissionFlagsBits.ViewChannel],
                },
                {
                    id: config.Guild.roles.support,
                    allow: [Discord.PermissionFlagsBits.SendMessages, Discord.PermissionFlagsBits.ViewChannel]
                }],
            parent: categoryID
        })

        if (messages.replyEmbed != null) {
            messages.replyEmbed.embed.description = `${messages.replyEmbed.embed.description} Нажмите здесь ${channel}.`
            await interaction.reply({ ephemeral: messages.replyEmbed.ephemeral, embeds: [messages.replyEmbed.embed] });
        }

        const msg = await channel.send({ content: `||${interaction.member}||`, embeds: [messages.ticketChannelEmbed.embed], components: messages.ticketChannelEmbed.components });

        if (messages.adminLogEmbed != null) {
            const c = interaction.guild.channels.cache.find(x => x.id == logChannelID && x.type == Discord.ChannelType.GuildText)
            await c.send({ embeds: [messages.adminLogEmbed.embed], components: messages.adminLogEmbed.components });
        }

        return {
            ChannelInfo: channel,
            MessageInfo: msg
        }
    };

    /**
     * Отправка логов в канал
     * @param {Discord.BaseInteraction} interaction => Interaction
     * @param {[Discord.APIEmbed]} msgContent => Контент сообщения
     * @param {string} filename => Имя файла
     * @param {string} logChannelID => ID канала для логов
     */
    async sendTicketLog(client, interaction, msgContent, filename, logChannelID, saveImages = false) {
        const htmlTicketLog = await transcript.createTranscript(interaction.channel, {
            limit: -1,
            returnType: 'attachment',
            saveImages: saveImages,
            filename: `${filename}.html`,
            poweredBy: false,
        })
        const messages = await interaction.channel.messages.fetch();
        const c = interaction.guild.channels.cache.find(x => x.id == logChannelID && x.type == Discord.ChannelType.GuildText)
        await c.send({ embeds: msgContent, files: [htmlTicketLog] });
    }

    /**
     * Закрытие тикета
     * @typedef {{_id: string, embed: Discord.APIEmbed, userIDModelName: string, model: mongoose.Model, closeBtnID: string, acceptClosingCreator: boolean}} CloseOptions
     * @param {Client} client 
     * @param {Discord.ButtonInteraction} interaction 
     * @param {CloseOptions} options
     * @param {function (interaction, CloseOptions.model)} callback
     * @returns 
     */
    async closeTicket(client, interaction, options, callback) {
        if (!await options.model.exists({ _id: options._id })) return client.dsHelper.ErrorEmbed(client, interaction, "В базе данных отсутствует запись об этой заявке", true, true);
        const model = await options.model.findOne({ _id: options._id });

        if (interaction.member.roles.cache.has(client.config.Guild.roles.support) || interaction.member.permissions.has("Administrator")) {
            const modal = new Discord.ModalBuilder({
                custom_id: "closeReasonTicketModal",
                title: "Закрытие тикета",
                components: [{
                    type: 1,
                    components: [{
                        type: Discord.ComponentType.TextInput,
                        style: Discord.TextInputStyle.Paragraph,
                        placeholder: "Решение которое вынесла поддержка...",
                        required: true,
                        label: "Решение",
                        custom_id: "reasonClose",
                        max_length: 1000,
                        min_length: 0
                    }]
                }]
            })

            await interaction.showModal(modal);

            await interaction.awaitModalSubmit({
                time: 300000,
                filter: i => i.user.id === interaction.user.id,
            }).then(async (i) => {
                (await interaction.guild.members.fetch(model.ids.authorID)).send({
                    embeds: [new Discord.EmbedBuilder({
                        author: { name: "Ваш тикет был рассмотрен и поддержка приняла следующее решение!" },
                        description: i.fields.getTextInputValue("reasonClose") == "" ? "Поддержка закрыла ваш тикет без указания решения!" : `Поддержка приняла следующее решение: \`${i.fields.getTextInputValue("reasonClose")}\``,
                        footer: { text: "Shalker Network" }
                    })]
                }).catch(async (err) => err == "DiscordAPIError[50007]: Cannot send messages to this user" ? await client.dsHelper.ErrorEmbed(client, interaction, "Не удалось отправить пользователю сообщение в ЛС\nНа это есть несколько причин:\n\n**1. У пользователя в настройках конфиденциальности на данном сервере выключен пункт \"Личные сообщения\"**\n\n**2. Пользователь заблокировал бота (Маловероятно)**",false, true, false, true) : await client.dshelper.ErrorEmbed(client, interaction, err, false, true, false, true));
        
                await callback(i, model);
            })
        } else {
            if ((options.acceptClosingCreator && interaction.user.id != model.ids[options.userIDModelName])) return await client.dsHelper.ErrorEmbed(client, interaction, "У вас нет прав чтобы использовать данный компонент!", true, true);
            await interaction.reply({
                embeds: [options.embed ?? {
                    title: "**ВЫ УВЕРЕНЫ В ЗАКРЫТИИ ДАННОЙ ЗАЯВКИ?**",
                    description: "После закрытия заявки данный канал будет удален.",
                    image: { url: "https://cdn.discordapp.com/attachments/621792624621256704/1076859608674619392/d40ade460b562945.png" },
                    color: 3092790
                }],
                components: [Discord.ActionRowBuilder.from({
                    type: 1,
                    components: [{
                        type: 2,
                        label: "Закрыть",
                        style: Discord.ButtonStyle.Danger,
                        custom_id: options.closeBtnID
                    }, {
                        type: 2,
                        label: "Отмена",
                        style: Discord.ButtonStyle.Secondary,
                        custom_id: "cancelClosebtn"
                    },]
                })],

            }).then(async (msg) => {
                const filter = (i) => i.user.id === interaction.member.id;
                let collector = await msg.createMessageComponentCollector({
                    filter: filter,
                });
                collector.on("collect", async (interaction) => {
                    if (interaction.isButton()) {
                        switch (interaction.customId) {
                            case "cancelClosebtn":
                                return await interaction.message.delete();

                            case options.closeBtnID:
                                await callback(interaction, model);
                                break;
                        }
                    }
                });
            })
        }
    }
}

module.exports = TicketHelper;