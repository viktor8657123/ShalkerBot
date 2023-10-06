const rcon = require('rcon-client').Rcon;

class RCON extends rcon {
    /**
     * @typedef {{host: string, port: number, password: string}} Options
     * @param {Options} options 
     */
    constructor(options) {
        super({ host: options.host, port: options.port, password: options.password });
    }

    /**
     * Отправка команд на сервер майнкрафт посредством RCON
     * @param {string[]} commands - Массив комнад
     * @returns Ответ команд
     */
    async sendRconCommands(commands) {
        await this.connect().then(console.log(`[INFO] RCON соединение было установленно!`));

        let responces = await Promise.all(commands.map((x) => {
            console.log(`[INFO] Выполенние команды "${x}"`);
            return this.send(x);
        }))

        this.once("error", (err) => console.log(`[ERROR] ${err}`));
        this.end().then(() => console.log('[INFO] RCON соединение закрыто!'));

        return responces;
    }
}

module.exports = RCON;