const mongoose = require('mongoose');
module.exports = mongoose.model('joinGuilds', mongoose.Schema({
    _id: String, //ID созданного в канале сообщение с информацией о игроке
    ids: { //Здесь находятся ID
        channelID: String, //ID канала где создалось сообщение с информацией о игроке
        guildID: String, //ID гильдии куда хочет вступить игрок
        authorID: String, //ID автора данной заявки
    },
    info: { //Информация о заявке
        nickname: String, //Никнейм игрока который подал заявку
        activity: String, //Активный ли игрок
        aboutYou: String  //Немного о себе
    }
}, { versionKey: false }))