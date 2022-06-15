require("dotenv").config();
const express = require("express");
const path = require("path");

// Importation des fonctionnalités du site
const mail = require("./features/mail");
const lendmail = require("./features/lend_mail");
const weather = require("./features/weather")
const about = require("./features/about")

// Configuration de l'Active Directory
const cors = require('cors');
const ActiveDirectory = require('activedirectory2');
const ad_config = { url: process.env.AD_SERVER,
               baseDN: process.env.AD_BASEDN,
               username: process.env.AD_USERNAME,
               password: process.env.AD_PASSWORD,
               attributes: {
                user: ['userPrincipalName', 'cn', 'telephoneNumber' ]
              } }
const ad = new ActiveDirectory(ad_config);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Page d'accueil
app.get("/", (req, res) => {
    weather.dataWeather().then(temp => {
        res.render('index.ejs', {
            weather: temp // Température à Saint-James
        });
    })
});

// Formulaire nouveau salarié
app.get("/form", (req, res) => {
    res.render("newworker.ejs", {
      mailstatus: ""
    });
});

// Formulaire prêt de matériel
app.get("/lend", async (req, res) => {
  const SERVER_IP = "http://localhost:3000/ad"
  const reponse = await fetch(SERVER_IP)
  const data = await reponse.json()

  res.render("lendhardware.ejs", {
    mailstatus: "",
    user: data
  });
});

// API pour l'Active Directory
app.get('/ad', cors(), (req, res) => {
  ad.findUsers(false, function(err, users) {
    if (err) { // Si échoue
      console.log('ERROR: ' +JSON.stringify(err));
      return;
    }
      
    if (! users) console.log("Aucun utilisateur n'a été trouvé."); // Si aucun utilisateur (OU incorrecte ?)
    else {
      res.end(JSON.stringify(users.sort((a, b) => a.cn.localeCompare(b.cn)))) // Envoie la liste par ordre alphabétique
    }
  });
});

// Liste des téléphones
app.get('/list', async (req, res) => {
  const SERVER_IP = "http://localhost:3000/ad"
  const reponse = await fetch(SERVER_IP)
  const data = await reponse.json()

  res.render("list.ejs", {
    user: data
  });
});

// Page à propos
app.get("/about", (req, res) => {
  res.render("about.ejs", {
    nodever: about.getProjectInfo([0]), // Version de Node.JS
    version: about.getProjectInfo([1]), // Version du site
    operatingsystem: about.getProjectInfo([2]) // Système d'exploitation du serveur
  });
});

// Page erreur 404
app.get('*', (req, res) => {
    res.render('404.ejs');
});

// Envoi du formulaire nouveau salarié à partir de la page web
app.post("/form", async (req, res, next) => {
    const { lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone } = req.body; // Charge les données du formulaire
    try {
      await mail.mainMail(lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone); // Envoie les valeurs du formulaire par email
      
      res.render("newworker.ejs", {
        mailstatus: "Formulaire envoyé avec succès"
      });
    } catch (error) {
      res.render("newworker.ejs", {
        mailstatus: "Échec de l'envoi"
      });

      console.log(error);
    }
});

// Envoi du formulaire demande de prêt
app.post("/lend", async (req, res, next) => {
  const { demandeur, service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment } = req.body; // Charge les données du formulaire
  try {
    await lendmail.mainMail(demandeur, service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment); // Envoie les valeurs du formulaire par email

    res.render("lendhardware.ejs", {
      mailstatus: "Formulaire envoyé avec succès",
      user: ""
    });
  } catch (error) {
    res.render("lendhardware.ejs", {
      mailstatus: "Échec de l'envoi",
      user: ""
    });

    console.log(error);
  }
});

// Hébergement du serveur sur le port 3000
app.listen(3000, () => console.log("Server is running!"));