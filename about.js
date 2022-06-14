const nodever = process.version
const pjson = require('./package.json')
const operatingsystem = process.platform

module.exports = {
    getProjectInfo: function (nbr) {
        const arr = [nodever, pjson.version, operatingsystem]
        return arr[nbr]
    }
}