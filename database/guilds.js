const mongoose = require('mongoose');
module.exports = mongoose.model('guilds', mongoose.Schema({
    _id: String,
    ids: { //Здесь находятся ID
        authorID: String, //ID создателя гильдии
        creatorRoleID: String, //ID роли главы гильдии
        memberRoleID: String, //ID роли участника гильдии
    },
    info: { //Информация о гилдии
        name: String, //Нзавание гильдии
        description: String, //Описание гильдии
        neutral: Boolean, //Нейтральна ли гильдия
        ownerName: String, //Имя владельца гильдии
        symbol: String, //Символ гильдий
        status: String //Статус заявки
    }
}, { versionKey: false }))