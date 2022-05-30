require("dotenv").config();
const express = require("express");
const path = require("path");
const mail = require("./mail")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Création d'une fonction asynchrone pour la météo
async function dataWeather() {
    const APICALL = `https://api.openweathermap.org/data/2.5/weather?lat=48.5218&lon=-1.32629&units=metric&appid=${process.env.WEATHER_APIKEY}`
    const reponse = await fetch(`${APICALL}`)
    const weather = await reponse.json()
    return `${weather.main.temp}°C`
}

// Page d'accueil
app.get("/", (req, res) => {
    dataWeather().then(temp => {
        res.render('index.ejs', {
            weather: temp
        });
    })
});

// Formulaire nouveau salarié
app.get("/form", (req, res) => {
    res.render('newworker.ejs');
});

// Page erreur 404
app.get('*', function(req, res){
    res.render('404.ejs');
});

// Envoi du formulaire à partir de la page web
app.post("/form", async (req, res, next) => {
    const { lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone } = req.body;
    try {
      console.log(lastname)
      console.log(firstname)
      console.log(birthdate)
      console.log(matricule)
      console.log(service)
      console.log(fonction)
      console.log(`Personne ${persontype}`)
      console.log(mail.isUndefined(needMail))
      console.log(mail.isUndefined(needComputer))
      console.log(mail.isUndefined(needPhone))
      console.log(mail.isUndefined(needMobilePhone))
      
      res.send("Formulaire envoyé avec succès!");
    } catch (error) {
      res.send("Échec de l'envoi");
    }
});

// app.post("/form", async (req, res, next) => {
//     const { lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone } = req.body;
//     try {
//       await mainMail(lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone);
      
//       res.send("Formulaire envoyé avec succès!");
//     } catch (error) {
//       res.send("Échec de l'envoi");
//     }
// });

// Hébergement du serveur sur le port 3000
app.listen(3000, () => console.log("Server is running!"));