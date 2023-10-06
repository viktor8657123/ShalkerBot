//Отдел констант
const Discord = require('discord.js');
const Command = require('./command.js');
const Event = require('./event.js');
const config = require('../jsons/config.json');
const messagesInfo = require('../jsons/MessagesInfo.json');
const Modal = require('./modal.js');
const Component = require('./component');
const mongoose = require('mongoose');
const fs = require('fs');
const Subcommand = require('./subcommand.js');
const RCON = require('./rcon.js');
const dsHelper = require('../libs/dshelper.js');
const TicketHelper = require('../libs/ticketsHelper.js');

//Отдел констант

//Класс клиента
class Client extends Discord.Client {
    constructor() {
        super({
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.GuildVoiceStates,
                Discord.GatewayIntentBits.MessageContent
            ], partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.GuildMember, Discord.Partials.User]
        })

        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        /**
         * @type {Discord.Collection<string>}
         */
        this.subcommands = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Component>}
         */
        this.components = new Discord.Collection();
        /**
         * @type {Discord.Collection<string, Modal>}
         */
        this.modals = new Discord.Collection();
        /**
         * @type {Discord.WebhookClient}
         */
        this.auditLog = new Discord.WebhookClient({ url: config.General.webhooks.webhookAuditUrl });
        /**
         * @type {config}
         */
        this.config = config;
        /**
         * @type {RCON}
         */
        this.rcon = new RCON({ host: config.General.rcon.host, port: config.General.rcon.port, password: config.General.rcon.password });
        /**
         * @type {dsHelper}
         */
        this.dsHelper = new dsHelper();
        /**
         * @type {TicketHelper}
         */
        this.tickets = new TicketHelper();
        /**
         * @type {messagesInfo}
         */
        this.MessageInfo = messagesInfo;

        /**
         * Система логирование непредвиденных ошибок (ErrorHook)
         */
        process.on("uncaughtException", async (err, origin) => {
            await new Discord.WebhookClient({ url: config.General.webhooks.webhookErrorUrl }).send({
                embeds: [new Discord.EmbedBuilder({
                    author: { name: "Произошла непредвиденная ошибка!", icon_url: "https://www.iconsdb.com/icons/download/red/warning-512.png" },
                    description: `\`\`\`${err.stack.length > 4000 ? `${err.stack.slice(0, 4000)}... детали в папке "logs"` : err.stack}\`\`\``,
                    footer: { text: "Система логирования ошибок | ShalkerBot", icon_url: "https://ds1nc.ru/assets/img/theds.png" },
                    color: Discord.Colors.Red
                })
                ]
            })
            fs.writeFileSync(`./logs/error_${new Date(Date.now()).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(" ", "_").replace(/:/g, "-")}.txt`, err.stack);

            console.log(`${err.stack}`);
            process.exit(1);
        })
    }

    async RunBot(token) {
        //Подключение БД
        mongoose.connect(config.General.dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
        mongoose.connection.on('connected', () => {
            console.log('[INFO] База данных успешно подключена!');
        })
        //Подключение БД

        //Обработчик команд
        /**
         * @type {Command[]}
         */
        const commands = fs.readdirSync('./commands/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .map(file => require(`../commands/${file}`));

        commands.forEach(cmd => {
            console.log(`[INFO] Команда: ${cmd.name} была добавлена в список команд!`);
            this.commands.set(cmd.name, cmd);
        })

        const slashCommands = commands
            .map(cmd => {
                let slashSubCommands;
                if (typeof (cmd.execute) == "undefined" && typeof (cmd.slashCommandOptions) == "undefined") {
                    fs.readdirSync("./subcommands/")
                        .forEach(folder => {
                            if (folder == cmd.name) {
                                const subcommands = fs.readdirSync(`./subcommands/${folder}/`)
                                    .filter(file => file.endsWith('.js'))
                                    .filter(file => !file.startsWith("_"))
                                    .map((subcommand) => {
                                        /**
                                         * @type {Subcommand}
                                         */
                                        const scommand = require(`../subcommands/${folder}/${subcommand}`);
                                        this.subcommands.set(`${cmd.name}.${scommand.name}`, scommand);
                                        console.log(`[INFO] Подкоманда: ${cmd.name} ${scommand.name} была загружена!`);
                                        return {
                                            name: scommand.name,
                                            type: Discord.ApplicationCommandOptionType.Subcommand,
                                            description: scommand.description,
                                            options: scommand.subCommandOptions
                                        }
                                    })

                                slashSubCommands = subcommands;
                            }
                        })
                }

                return {
                    name: cmd.name,
                    description: cmd.description,
                    defaultMemberPermissions: cmd.permissions,
                    options: slashSubCommands ?? cmd.slashCommandOptions,
                    defaultPermission: true
                }
            })

        this.removeAllListeners();
        this.on("ready", async () => {
            const command = await (await this.guilds.fetch(config.General.guildID)).commands.set(slashCommands);

            command.forEach((cmd) => {
                console.log(`[INFO] Slash команда "${cmd.name} была загружена"`);
            })
        })

        //Обработчик ивентов
        fs.readdirSync('./events/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .forEach(file => {
                /**
                 * @type {Event}
                 */
                const event = require(`../events/${file}`)
                console.log(`[INFO] Ивент: ${event.event} был загружен`)
                this.on(event.event, event.run.bind(null, this))
            })

        //Обработчик компонентов
        fs.readdirSync('./components/').forEach(typeFolder => {
            fs.readdirSync(`./components/${typeFolder}/`)
                .filter(file => file.endsWith('.js'))
                .filter(file => !file.startsWith("_"))
                .forEach((component) => {
                    const cmp = require(`../components/${typeFolder}/${component}`);
                    this.components.set(cmp.componentID, cmp);

                    switch (cmp.componentType) {
                        case Discord.ComponentType.Button:
                            console.log(`[INFO] Компонент (Кнопка) с ID "${cmp.componentID}" была успешно загружена`);
                            break;

                        case Discord.ComponentType.ChannelSelect:
                        case Discord.ComponentType.MentionableSelect:
                        case Discord.ComponentType.RoleSelect:
                        case Discord.ComponentType.StringSelect:
                        case Discord.ComponentType.UserSelect:
                            console.log(`[INFO] Компонент (selectMenu) с ID "${cmp.componentID}" была успешно загружена`);
                            break;
                    }
                })
        })

        //Обработчик модальных окон
        fs.readdirSync('./modals/')
            .filter(file => file.endsWith('.js'))
            .filter(file => !file.startsWith("_"))
            .forEach((modal) => {
                const md = require(`../modals/${modal}`);
                this.modals.set(md.modalID, md);
                console.log(`[INFO] Модальное окно с ID "${md.modalID}" была успешно загружено`);
            })

        //Логин бота
        this.login(token).catch(err => {
            if (err == "Error [TOKEN_INVALID]: An invalid token was provided.") {
                return console.log("Ошибка:\nТокен недействителен или он отсутствует");
            }
            return console.log(err)
        })
    }
}

module.exports = Client;