const SERVER_IP = "http://localhost:3000/ad"
const userlist = document.querySelector('main')

// Création d'une fonction asynchrone
async function callAPI() {
    const reponse = await fetch(SERVER_IP)
    const data = await reponse.json()
    console.log(data)

    creationCarte(data)
}

// Affichage de la carte de la maison
function creationCarte(user) {
    for(let i = 0; i < user.length; i++) {
        const carteHTML = `
            <div class="card">
                <p class="user-fullname">${user[i].cn}</p>
                <p class="user-email">${user[i].userPrincipalName}</p>
            </div>
        `

        userlist.innerHTML += carteHTML
    }
}

callAPI()