require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Fonction pour vérifier les besoins des utilisateurs dans les formulaires
function isUndefined(element) {
    if (element === undefined) {
        return "Non"
    }
    else {
        return "Oui"
    }
}

// Création d'une fonction asynchrone pour la météo
async function dataWeather() {
    const APICALL = `https://api.openweathermap.org/data/2.5/weather?lat=48.5218&lon=-1.32629&units=metric&appid=${process.env.WEATHER_APIKEY}`
    const reponse = await fetch(`${APICALL}`)
    const weather = await reponse.json()
    return `${weather.main.temp}°C`
}

// Fonction asynchrone pour l'envoi du formulaire
async function mainMail(lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone) {
    const transporter = await nodeMail.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    const mailOption = {
      from: process.env.SMTP_EMAIL,
      to: process.env.GLPI_EMAIL,
      subject: subject,
      html: `Nom: ${lastname}
        <br>
        Prénom: ${firstname}
        <br>
        Date de naissance: ${birthdate}
        <br>
        Matricule: ${matricule}
        <br>
        Service: ${service}
        <br>
        Fonction: ${fonction}
        <br>
        Personne ${persontype}
        <br>
        <br>
        Besoins:
        <br>
        Adresse mail: ${isUndefined(needMail)}
        <br>
        PC / Portable: ${isUndefined(needComputer)}
        <br>
        Téléphone fixe: ${isUndefined(needPhone)}
        <br>
        Téléphone mobile: ${isUndefined(needMobilePhone)}`,
    };
    try {
      await transporter.sendMail(mailOption);
      return Promise.resolve("Message Sent Successfully!");
    } catch (error) {
      console.log(error)
      return Promise.reject(error);
    }
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
      console.log(isUndefined(needMail))
      console.log(isUndefined(needComputer))
      console.log(isUndefined(needPhone))
      console.log(isUndefined(needMobilePhone))
      
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