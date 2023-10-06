const Event = require('../structure/event.js');

module.exports = new Event('ready', client => {
    console.clear();
    console.log(`ShalkerBot v${require('../package.json').version} was loaded\nc0d9d by DesConnet!`)
    //client.user.setActivity({name: "Test using once setActivity", type: Discord.ActivityType.Competing})
})