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
        <a href="http://${host.data[i].attributes.ip}" target="_blank">
            <div class="card">
                <p class="host-title">${host.data[i].attributes.name}</p>
                <p class="host-ip">${host.data[i].attributes.ip}</p>
                <div class="host-div">
                    <div class="status-color"></div>
                    <p class="host-status">Chargement...</p>
                </div>
            </div>
        </a>
        `

        fetch(`http://${host.data[i].attributes.ip}`, {mode: 'no-cors'}).then(r=>{ // Si le serveur est joignable
            document.querySelectorAll('.host-status')[i].innerText = "En ligne"
            document.querySelectorAll('.status-color')[i].style.backgroundColor = "green"
            })
            .catch(e=>{ // Si le serveur n'est pas joignable
                document.querySelectorAll('.host-status')[i].innerText = "Hors ligne"
                document.querySelectorAll('.status-color')[i].style.backgroundColor = "red"
          })

        hostlist.innerHTML += carteHTML
    }
}

callAPI()