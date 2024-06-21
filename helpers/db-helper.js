const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const { successPerWin } = require('../config.json')

module.exports.Stats = sequelize.define('stats', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    success: Sequelize.INTEGER,
    streak: Sequelize.INTEGER,
    bestStreak: Sequelize.INTEGER,

});

module.exports.getUserStats = async function (member) {

    return new Promise(async (resolve, reject) => {
        const stats = await this.Stats.findOne({ where: { id: member } });

		if (stats) {
			resolve(stats)
		} else {
            const newStats = this.Stats.create({ id: member, success: 1, streak: 0, bestStreak: 0 })
            resolve(newStats)

        }
    })
}

module.exports.addUserStats = async function (member, value) {
    return new Promise(async (resolve, reject) => {
        const stats = await this.Stats.findOne({ where: { id: member } });

		if (stats) {
            stats.setDataValue('success', stats.get("success") + successPerWin)
            stats.save()
            resolve(stats)
		} else {
            const newStats = this.Stats.create({ id: member, success: 1, streak: 0, bestStreak: 0 })
            resolve(newStats)

        }
        
    })
}

module.exports.updateWinStreak = async function (member, win) {
    return new Promise(async (resolve, reject) => {
        const stats = await this.Stats.findOne({ where: { id: member } });

		if (stats) {
            if (win) {
                stats.setDataValue('streak', stats.get("streak") + 1)
                stats.setDataValue('bestStreak', Math.max(stats.get("streak"), stats.get("bestStreak")))
            } else {
                stats.setDataValue('bestStreak', stats.get("streak"))
                stats.setDataValue('streak', 0)
            }
            stats.save()
            resolve(stats)
		} else {
            const newStats = this.Stats.create({ id: member, success: 1, streak: 0, bestStreak: 0})
            resolve(newStats)

        }
        
    })
}


