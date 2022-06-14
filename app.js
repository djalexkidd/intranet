require("dotenv").config();
const express = require("express");
const path = require("path");
const mail = require("./mail");
const weather = require("./weather")
const about = require("./about")
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

const groupName = process.env.AD_GROUPNAME;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');

// Page d'accueil
app.get("/", (req, res) => {
    weather.dataWeather().then(temp => {
        res.render('index.ejs', {
            weather: temp
        });
    })
});

// Formulaire nouveau salarié
app.get("/form", (req, res) => {
    res.render("newworker.ejs", {
      mailstatus: ""
    });
});

// API pour l'Active Directory
app.get('/ad', cors(), function(req, res){
  ad.getUsersForGroup(groupName, function(err, users) {
    if (err) {
      console.log('ERROR: ' +JSON.stringify(err));
      return;
    }
      
    if (! users) console.log('Groupe: ' + groupName + ' non trouvé.');
    else {
      console.log(JSON.stringify(users));
      res.end(JSON.stringify(users.sort((a, b) => a.cn.localeCompare(b.cn))))
    }
  });
});

// Liste des téléphones
app.get('/list', async function(req, res){
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
    nodever: about.getProjectInfo([0]),
    version: about.getProjectInfo([1]),
    operatingsystem: about.getProjectInfo([2])
  });
});

// Page erreur 404
app.get('*', function(req, res){
    res.render('404.ejs');
});

// Envoi du formulaire à partir de la page web
app.post("/form", async (req, res, next) => {
    const { lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone } = req.body;
    try {
      await mail.mainMail(lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone);
      
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

// Hébergement du serveur sur le port 3000
app.listen(3000, () => console.log("Server is running!"));