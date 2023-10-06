const mongoose = require('mongoose');
module.exports = mongoose.model('applications', mongoose.Schema({
    _id: String, //ID созданного в лог канале сообщение
    ids: { //Здесь находятся ID
        authorID: String, //ID автора данной заявки
        adminMsgID: String, //ID сообщения в админском канале
        channelID: String, //ID канала где создалось сообщение с заявкой
    },
    info: { //Информация о заявке
        nickname: String, //Никнейм игрока 
        reportApplication: String, //Причина почему вы выбрали нас?
        plans: String, //О своих планов
        readRules: String, //Читали ли вы правила
        aboutYou: String, //Немного о себе
        status: String //Статус заявки
    }
}, { versionKey: false }))