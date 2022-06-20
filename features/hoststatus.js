const isPortReachable = require('is-port-reachable')

module.exports = {
    checkHost: async function (hosts) {
        let hoststatus = []

        for(let i = 0; i < hosts.data.length; i++) {
          const hostURL = new URL(`http://${hosts.data[i].attributes.ip}`)
          hoststatus[i] = await isPortReachable(hostURL.port == "" ? 80 : hostURL.port, {host: hostURL.hostname})
        }
      
        return hoststatus
    }
}