const APICALL = "https://api.openweathermap.org/data/2.5/weather?lat=48.5218&lon=-1.32629&units=metric&appid=0"
const affichage = document.querySelector('.weather-widget')

// Création d'une fonction asynchrone
async function dataWeather() {
    const reponse = await fetch(`${APICALL}`)
    const data = await reponse.json()
    console.log(data)

    creationWidget(data)
}

// Affichage du widget météo
function creationWidget(weather) {
    const carteHTML = `
    <p class="card-title">Température à Saint-James</p>
    <p class="card-value">${weather.main.temp}°C</p>
    `

    affichage.innerHTML = carteHTML
}

/* Envoi de la requête */
dataWeather()