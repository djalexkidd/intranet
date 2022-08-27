require("dotenv").config();
const express = require("express");
const path = require("path");
const isPortReachable = require('is-port-reachable')
const cookieParser = require('cookie-parser')
const https = require("https");
const fs = require("fs");

// Importation des fonctionnalités du site
const mail = require("./features/mail");
const lendmail = require("./features/lend_mail");
const jobmail = require("./features/applyjob");
const weather = require("./features/weather")
const about = require("./features/about")
const hostlist = require("./features/hoststatus")
const authcheck = require("./features/cookie")
const jobs = require("./features/jobs")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.use(cookieParser());

// Configuration de l'Active Directory
function getAdUser(req) {
  const ActiveDirectory = require('activedirectory2');
  const ad_config = { url: process.env.AD_SERVER,
         baseDN: process.env.AD_BASEDN,
         username: req.cookies.token,
         password: req.cookies.token2,
         attributes: {
          user: ['userPrincipalName', 'cn', 'telephoneNumber', 'mobile', 'title', 'givenName', 'department', 'ipPhone', 'distinguishedName', 'mail', 'streetAddress', 'l']
        } }
  const ad = new ActiveDirectory(ad_config);

  return ad
}

function isStrapiConnected(req) {
  if (req.cookies.jwt !== undefined) {
    return true
  } else {
    return false
  }
}

// Middleware pour vérifier si l'utilisateur est authentifié
app.all('*', checkUser);

function checkUser(req, res, next) {
  if (req.path == '/login') return next();

  if (authcheck.checkCookie(req.cookies.token)) {
    next();
  } else {
    res.redirect("/login")
  }
}

// === REQUETES GET ===

// Page d'accueil
app.get("/", async (req, res) => {
  try {
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
  } catch {
      weather.dataWeather().then(value => {
        res.render('index.ejs', {
          weather: value, // Température à Saint-James
          host: {data: []}, // Données de Strapi
          hoststatus: {}, // État des serveurs
          useremail: req.cookies.token
        });
    });
  }
});

// Formulaire nouveau salarié
app.get("/form", (req, res) => {
    res.render("newworker.ejs", {
      mailstatus: "",
      useremail: req.cookies.token
    });
});

// Formulaire prêt de matériel
app.get("/lend", async (req, res) => {
    res.render("lendhardware.ejs", {
      mailstatus: "",
      useremail: req.cookies.token
    });
  }
);

// Liste des téléphones
app.get('/list', (req, res) => {
  const query = 'cn=*' + req.query.search + '*';

  getAdUser(req).findUsers(req.query.search === "" || req.query.search === undefined ? false : query, function(err, users) {
    if (err) { // Si échoue
      console.log('ERROR: ' +JSON.stringify(err));
      res.render("error.ejs");
      return;
    }
      
    if (! users) console.log("Aucun utilisateur n'a été trouvé."); // Si aucun utilisateur (OU incorrecte ?)
    else {
      res.render("list.ejs", {
        user: users.sort((a, b) => a.cn.localeCompare(b.cn)),
        useremail: req.cookies.token
      });
    }
  });
});

// Page à propos
app.get("/about", async (req, res) => {
  res.render("about.ejs", {
    nodever: about.getProjectInfo([0]), // Version de Node.JS
    version: about.getProjectInfo([1]), // Version du site
    operatingsystem: about.getProjectInfo([2]), // Système d'exploitation du serveur
    adstatus: await isPortReachable(389, {host: process.env.AD_SERVER.substring(7)}),
    mailstatus: await isPortReachable(process.env.SMTP_PORT, {host: process.env.SMTP_SERVER}),
    strapistatus: await isPortReachable(1337, {host: "127.0.0.1"}),
    useremail: req.cookies.token
  });
});

// Page d'authentification
app.get("/login", (req, res) => {
  res.render("login.ejs", {
    error: ""
  });
});

// Déconnexion
app.get('/logout', (req, res) => {
  res.clearCookie("token");
  res.clearCookie("token2");
  res.clearCookie("jwt");
  res.redirect('/login');
});

// Page d'offres d'emploi
app.get("/jobs", async (req, res) => {
    jobs.dataJobs().then(jobsdata => {
      res.render('jobs.ejs', {
          job: jobsdata,
          strapiStatus: isStrapiConnected(req),
          useremail: req.cookies.token
      });
    })
});

// Création offre d'emploi
app.get("/newjob", async (req, res) => {
      res.render('newjob.ejs', {
          useremail: req.cookies.token
      });
});

// Détails de l'offre d'emploi
app.get("/viewjob", async (req, res) => {
    jobs.viewJob(req.query.id).then(jobdata => {
      res.render('viewjob.ejs', {
          job: jobdata,
          strapiStatus: isStrapiConnected(req),
          useremail: req.cookies.token
      });
    })
});

// Suppression d'une offre d'emploi
app.get("/jobdelete", async (req, res) => {
    jobs.deleteJob(req.query.id, req.cookies.jwt).then(jobdata => {
      res.redirect("/jobs")
    })
});

// Modification d'une offre d'emploi
app.get("/editjob", async (req, res) => {
    jobs.viewJob(req.query.id).then(jobdata => {
      res.render('editjob.ejs', {
          job: jobdata,
          useremail: req.cookies.token
      });
    })
});

// Connexion à Strapi
app.get("/loginjob", async (req, res) => {
    res.render("loginjob.ejs", {
      error: "",
      useremail: req.cookies.token
    });
  }
);

// Envoi d'une demande d'emploi
app.get("/applyjob", async (req, res, next) => {
  getAdUser(req).findUser(req.cookies.token, async function(err, user) {
  try {
    await jobmail.mainMail(req.cookies.token, req.cookies.token2, user.cn, user.mail, req.query.id, user.telephoneNumber); // Envoie les valeurs du formulaire par email

    res.send("Succès");
  } catch (error) {
    res.send(error);

    console.log(error);
  }
  });
});

// Page erreur 404
app.get('*', (req, res) => {
    res.render('404.ejs');
});

// === REQUETES POST ===

// Envoi du formulaire nouveau salarié à partir de la page web
app.post("/form", async (req, res, next) => {
  getAdUser(req).findUser(req.cookies.token, async function(err, user) {
    const { lastname, firstname, birthdate, service, fonction, persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone } = req.body; // Charge les données du formulaire
    try {
      await mail.mainMail(lastname, firstname, birthdate, service, fonction, persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone, req.cookies.token, req.cookies.token2, user.cn, user.mail); // Envoie les valeurs du formulaire par email
      
      res.render("newworker.ejs", {
        mailstatus: "Formulaire envoyé avec succès",
        useremail: req.cookies.token
      });
    } catch (error) {
      res.render("newworker.ejs", {
        mailstatus: "Échec de l'envoi",
        useremail: req.cookies.token
      });

      console.log(error);
    }
  });
});

// Envoi du formulaire demande de prêt
app.post("/lend", async (req, res, next) => {
  getAdUser(req).findUser(req.cookies.token, async function(err, user) {
  const { service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment } = req.body; // Charge les données du formulaire
  try {
    await lendmail.mainMail(req.cookies.token, service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment, req.cookies.token2, user.cn, user.mail); // Envoie les valeurs du formulaire par email

    res.render("lendhardware.ejs", {
      mailstatus: "Formulaire envoyé avec succès",
      useremail: req.cookies.token
    });
  } catch (error) {
    res.render("lendhardware.ejs", {
      mailstatus: "Échec de l'envoi",
      useremail: req.cookies.token
    });

    console.log(error);
  }
  });
});

// Envoi du formulaire de connexion
app.post('/login', (req, res, next) => {
  const { userEmail, userPassword } = req.body; // Charge les données du formulaire
  getAdUser(req).authenticate(userEmail + "@" + process.env.DOMAIN_NAME, userPassword, function(err, auth) {
    if (err) {
        console.log('ERROR: '+JSON.stringify(err));
        res.render("login.ejs", {
          error: "Nom d'utilisateur ou mot de passe incorrect."
        });
        return;
    }
    if (auth) {
        res.cookie(`token`, userEmail + "@" + process.env.DOMAIN_NAME);
        res.cookie(`token2`, userPassword);
        console.log(userEmail + " s'est connecté !");
        res.redirect('/');
    }
    else {
        console.log('Authentication failed!');
        res.render("login.ejs", {
          error: "Nom d'utilisateur ou mot de passe incorrect."
        });
    }
  });
});

// Recherche de téléphones
app.post('/list', (req, res, next) => {
  const { search } = req.body;

  res.redirect('/list?search=' + search)
});

// Envoi d'une offre d'emploi
app.post('/newjob', (req, res, next) => {
  const { jobName, jobDetails } = req.body; // Charge les données du formulaire

  jobs.submitJob(jobName, jobDetails, req.cookies.jwt)

  res.redirect('/jobs')
});

// Modification d'une offre d'emploi
app.post('/editjob', (req, res, next) => {
  const { jobName, jobDetails } = req.body; // Charge les données du formulaire

  jobs.editJob(req.query.id, jobName, jobDetails, req.cookies.jwt)

  res.redirect('/jobs')
});

// Connexion à Strapi
app.post('/loginjob', async (req, res, next) => {
  const { password } = req.body; // Charge les données du formulaire

  await jobs.strapiConnect(password, res, req.cookies.token)
});

// Hébergement du serveur
if (process.env.SSL === "true") { // Si SSL est activé dans les envvars le site utilisera HTTPS
  https.createServer({
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT),
    },app).listen(process.env.PORT, ()=>{
      console.log("Server is running! HTTPS PORT " + process.env.PORT)
  });
} else { // Sinon utiliser HTTP
  app.listen(process.env.PORT, () => console.log("Server is running! HTTP PORT " + process.env.PORT));
}