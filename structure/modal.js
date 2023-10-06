const Discord = require('discord.js');
const Client = require('./client.js');

/**
 * 
 * @param {Client} client 
 * @param {Discord.ModalSubmitInteraction} interaction
 */
async function ExecuteFuctions(client, interaction) { }

//Класс кнопки
class Modal {
    /**
     * @typedef {{modalID: string, permission: Discord.PermissionsString, acceptRoles: string[], execute: ExecuteFuctions}} ModalOptions
     * @param {ModalOptions} options
     */
    constructor(options) {
        this.modalID = options.modalID;
        this.permission = options.permission;
        this.acceptRoles = options.acceptRoles;
        this.execute = options.execute;
    }
}

module.exports = Modal;