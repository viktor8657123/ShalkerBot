const mongoose = require('mongoose');
module.exports = mongoose.model('supports', mongoose.Schema({
    _id: String, //ID созданного в канале сообщение с информацией о кандидате
    ids: { //Здесь находятся ID
        channelID: String, //ID канала где создалось сообщение с информацией о кандидате
        authorID: String, //ID автора данной заявки
    },
    info: { //Информация о заявке
        nickname: String, //Никнейм игрока который подал заявку
        age: String, //Возраст
        grade: String  //Оценка знаний
    }
}, { versionKey: false }))