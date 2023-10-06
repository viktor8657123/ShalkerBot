const mongoose = require('mongoose');
module.exports = mongoose.model('builds', mongoose.Schema({
    _id: String, //ID созданного в канале сообщение с информацией о постройке
    ids: { //Здесь находятся ID
        channelID: String, //ID канала где создалось сообщение с информацией о постройке
        authorID: String, //ID автора данной заявки
    },
    info: { //Информация о заявке
        nickname: String, //Никнейм игрока который подал заявку
        idea: String, //Идея
        playingHours: String  //Наиграно часов
    }
}, { versionKey: false }))