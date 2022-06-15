const nodever = process.version // Version de Node.JS
const pjson = require('../package.json') // Version du site
const operatingsystem = process.platform // Système d'exploitation du serveur

const arr = [nodever, pjson.version, operatingsystem]

module.exports = {
    getProjectInfo: function (nbr) {
        return arr[nbr]
    }
}