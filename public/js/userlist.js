const SERVER_IP = "http://localhost:3000/ad"
const userlist = document.querySelector('table')

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
            <tr>
              <td>${user[i].cn}</td>
              <td>${user[i].userPrincipalName}</td>
              <td>${user[i].telephoneNumber}</td>
            </tr>
        `

        userlist.innerHTML += carteHTML
    }
}

callAPI()