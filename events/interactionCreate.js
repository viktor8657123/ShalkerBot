const Event = require('../structure/event.js');
const { InteractionType, ChannelType, EmbedBuilder } = require('discord.js');

module.exports = new Event('interactionCreate', async (client, interaction) => {
    if (interaction.user.bot) return;

    switch (interaction.type) {
        case InteractionType.ApplicationCommand:
            if (interaction.channel.type == ChannelType.DM) return;
            try {
                const args = interaction.options;
                if (args.getSubcommand(false)) {
                    const subcommand = client.subcommands.find(cmd => cmd.name == args.getSubcommand(false));   
                    if (!subcommand) return;

                    await subcommand.execute(client, args, interaction);
                } else {
                    const command = client.commands.find(cmd => cmd.name == interaction.commandName);
                    if (!command) return;

                    await command.execute(client, args, interaction);
                }
            } catch (err) {
                await client.dsHelper.ErrorEmbed(client, interaction, err, true, false);
            }
            break;

        case InteractionType.MessageComponent:
            try {
                const component = client.components.find((x) => x.componentType == interaction.componentType && x.componentID == interaction.customId)
                if (!component) return;
                await client.auditLog.send({
                    embeds: [new EmbedBuilder({
                        description: `[Ссылка на сообщение](${interaction.message.url})`,
                        fields: [{
                            name: "Название:",
                            value: `${interaction.component.label}`,
                            inline: true
                        }, {
                            name: "ID компонента:",
                            value: `${interaction.customId}`,
                            inline: true
                        }, {
                            name: "Пользователь:",
                            value: `${interaction.member}`,
                            inline: true
                        }],
                        author: {
                            name: `Пользователь ${interaction.user.tag} нажал на компонент`,
                            icon_url: `${interaction.user.displayAvatarURL({ dynamic: true })}`
                        },
                        timestamp: Date.now()
                    }).setColor("LuminousVividPink")]
                });
                if (interaction.inGuild() && !component.acceptRoles.some(x => interaction.member.roles.cache.has(x)) && !interaction.member.permissions.has(component.permission)) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true);
                await component.execute(client, interaction);
            } catch (err) {
                await client.dsHelper.ErrorEmbed(client, interaction, err, true, true);
            }
            break;

        case InteractionType.ModalSubmit:
            try {
                const Modal = client.modals.get(interaction.customId);
                if (!Modal) return;
                if (interaction.inGuild() && !Modal.acceptRoles.some(x => interaction.member.roles.cache.has(x)) && !interaction.member.permissions.has(Modal.permission)) return await client.dsHelper.ErrorEmbed(client, interaction, "У тебя нет прав для использования данного компонента!", true, true);
                await Modal.execute(client, interaction);
            } catch (err) {
                await client.dsHelper.ErrorEmbed(client, interaction, err, true, true);
            }
            break;
    }
});