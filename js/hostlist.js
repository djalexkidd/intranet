const STRAPI_IP = "http://localhost:1337/api/hosts"
const hostlist = document.querySelector('main')

// Création d'une fonction asynchrone
async function callAPI() {
    const reponse = await fetch(STRAPI_IP)
    const data = await reponse.json()
    console.log(data)

    creationCarte(data)
}

// Affichage de la carte de la maison
function creationCarte(host) {
    for(let i = 0; i < host.data.length; i++) {
        const carteHTML = `
        <a href="http://${host.data[i].attributes.ip}">
            <div class="card">
                <p class="host-title">${host.data[i].attributes.name}</p>
                <p class="host-ip">${host.data[i].attributes.ip}</p>
                <p class="host-status">Chargement...</p>
            </div>
        </a>
        `

        fetch(`http://${host.data[i].attributes.ip}`, {mode: 'no-cors'}).then(r=>{ // Si le serveur est joignable
            document.querySelectorAll('.host-status')[i].innerText = "En ligne"
            })
            .catch(e=>{ // Si le serveur n'est pas joignable
                document.querySelectorAll('.host-status')[i].innerText = "Hors ligne"
          })

        hostlist.innerHTML += carteHTML
    }
}

callAPI()