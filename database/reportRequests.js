const mongoose = require('mongoose');
module.exports = mongoose.model('reportRequests', mongoose.Schema({
    _id: String, //ID созданного в канале репорта сообщение
    ids: { //Здесь находятся ID
        channelID: String, //ID канала где создалось сообщение с репортом
        authorID: String, //ID автора данного репорта
    },
    info: { //Информация о репорте
        reportNickname: String, //Никнейм игрока на которого подали жалобу
        reportReason: String //Причина жалобы
    }
}, { versionKey: false }))