module.exports = {
    checkCookie: function (input) {
        if (input !== undefined && input.includes(process.env.DOMAIN_NAME)) {
            return true
        }
        else {
            return false
        }
    }
}