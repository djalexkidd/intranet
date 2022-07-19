require("dotenv").config();
const express = require("express");
const path = require("path");
const isPortReachable = require('is-port-reachable')
const cookieParser = require('cookie-parser')

// Importation des fonctionnalités du site
const mail = require("./features/mail");
const lendmail = require("./features/lend_mail");
const weather = require("./features/weather")
const about = require("./features/about")
const hostlist = require("./features/hoststatus")
const authcheck = require("./features/cookie")

// Configuration de l'Active Directory
const ActiveDirectory = require('activedirectory2');
const ad_config = { url: process.env.AD_SERVER,
               baseDN: process.env.AD_BASEDN,
               username: process.env.AD_USERNAME,
               password: process.env.AD_PASSWORD,
               attributes: {
                user: ['userPrincipalName', 'cn', 'telephoneNumber', 'otherTelephone', 'ipPhone']
              } }
const ad = new ActiveDirectory(ad_config);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.use(cookieParser());

// Page d'accueil
app.get("/", async (req, res) => {
  const STRAPI_IP = "http://127.0.0.1:1337/api/hosts"
  const reponse = await fetch(STRAPI_IP)
  const hosts = await reponse.json()

  Promise.all([weather.dataWeather(), hosts, hostlist.checkHost(hosts)]).then((values) => {
    res.render('index.ejs', {
      weather: values[0], // Température à Saint-James
      host: values[1], // Données de Strapi
      hoststatus: values[2], // État des serveurs
      useremail: req.cookies.token
    });
  });
});

// Formulaire nouveau salarié
app.get("/form", (req, res) => {
  if (authcheck.checkCookie(req.cookies.token)) {
    res.render("newworker.ejs", {
      mailstatus: ""
    });
  } else {
    res.redirect("/login")
  }
});

// Formulaire prêt de matériel
app.get("/lend", async (req, res) => {
  if (authcheck.checkCookie(req.cookies.token)) {
    res.render("lendhardware.ejs", {
      mailstatus: ""
    });
  } else {
    res.redirect("/login")
  }
  }
);

// Liste des téléphones
app.get('/list', (req, res) => {
  if (authcheck.checkCookie(req.cookies.token)) {
  ad.findUsers(false, function(err, users) {
    if (err) { // Si échoue
      console.log('ERROR: ' +JSON.stringify(err));
      res.render("error.ejs");
      return;
    }
      
    if (! users) console.log("Aucun utilisateur n'a été trouvé."); // Si aucun utilisateur (OU incorrecte ?)
    else {
      res.render("list.ejs", {
        user: users.sort((a, b) => a.cn.localeCompare(b.cn))
      });
    }
  });
  } else {
    res.redirect("/login")
  }
});

// Page à propos
app.get("/about", async (req, res) => {
  if (authcheck.checkCookie(req.cookies.token)) {
  res.render("about.ejs", {
    nodever: about.getProjectInfo([0]), // Version de Node.JS
    version: about.getProjectInfo([1]), // Version du site
    operatingsystem: about.getProjectInfo([2]), // Système d'exploitation du serveur
    adstatus: await isPortReachable(389, {host: process.env.AD_SERVER.substring(7)}),
    mailstatus: await isPortReachable(process.env.SMTP_PORT, {host: process.env.SMTP_SERVER}),
    strapistatus: await isPortReachable(1337, {host: "127.0.0.1"})
  });
  } else {
    res.redirect("/login")
  }
});

// Page d'authentification
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Page erreur 404
app.get('*', (req, res) => {
    res.render('404.ejs');
});

// Envoi du formulaire nouveau salarié à partir de la page web
app.post("/form", async (req, res, next) => {
    const { lastname, firstname, birthdate, service, fonction, persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone } = req.body; // Charge les données du formulaire
    try {
      await mail.mainMail(lastname, firstname, birthdate, service, fonction, persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone); // Envoie les valeurs du formulaire par email
      
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
  const { service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment } = req.body; // Charge les données du formulaire
  try {
    await lendmail.mainMail(req.cookies.token, service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment); // Envoie les valeurs du formulaire par email

    res.render("lendhardware.ejs", {
      mailstatus: "Formulaire envoyé avec succès"
    });
  } catch (error) {
    res.render("lendhardware.ejs", {
      mailstatus: "Échec de l'envoi"
    });

    console.log(error);
  }
});

// Envoi du formulaire de connexion
app.post('/login', (req, res, next) => {
  const { userEmail, userPassword } = req.body; // Charge les données du formulaire
  ad.authenticate(userEmail, userPassword, function(err, auth) {
    if (err) {
        console.log('ERROR: '+JSON.stringify(err));
        res.redirect('/login');
        return;
    }
    if (auth) {
        res.cookie(`token`, userEmail);
        console.log('Authenticated!');
        res.redirect('/');
    }
    else {
        console.log('Authentication failed!');
        res.redirect('/login');
    }
  });
});

// Hébergement du serveur sur le port 3000
app.listen(3000, () => console.log("Server is running!"));