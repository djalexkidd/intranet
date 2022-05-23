const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Création d'une fonction asynchrone pour la météo
async function dataWeather() {
    const APICALL = "https://api.openweathermap.org/data/2.5/weather?lat=48.5218&lon=-1.32629&units=metric&appid=0"
    const reponse = await fetch(`${APICALL}`)
    const weather = await reponse.json()
    return `${weather.main.temp}°C`
}

app.get("/", (req, res) => {
    dataWeather().then(temp => {
        res.render('index.ejs', {
            weather: temp
        });
    })
});

app.get("/form", (req, res) => {
    res.render('newworker.ejs');
});

app.listen(3000, () => console.log("Server is running!"));