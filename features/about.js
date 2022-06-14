const nodever = process.version
const pjson = require('../package.json')
const operatingsystem = process.platform

const arr = [nodever, pjson.version, operatingsystem]

module.exports = {
    getProjectInfo: function (nbr) {
        return arr[nbr]
    }
}