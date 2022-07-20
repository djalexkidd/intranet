// Création d'une fonction asynchrone pour la météo
module.exports = {
    dataWeather: async function () {
        try {
            const APICALL = `https://api.openweathermap.org/data/2.5/weather?lat=48.5218&lon=-1.32629&units=metric&appid=${process.env.WEATHER_APIKEY}`
            const reponse = await fetch(APICALL)
            const weather = await reponse.json()
            return `${weather.main.temp}°C`
        }
        catch {
            return "Indisponible"
        }
    }
}