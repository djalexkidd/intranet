module.exports = {
    checkCookie: function (input) {
        if (input.token !== "") {
            return false
        }
        else {
            return true
        }
    }
}