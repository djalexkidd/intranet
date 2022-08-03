const nodeMail = require("nodemailer");

// Fonction pour vérifier les besoins des utilisateurs dans les formulaires
function isUndefined(element) {
  if (element === undefined) {
      return "Non"
  }
  else {
      return "Oui"
  }
}

// Fonction asynchrone pour l'envoi du formulaire
module.exports = {
    mainMail: async function (demandeur, service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment, smtpPass) {
      const transporter = await nodeMail.createTransport({
        service: "Outlook365",
        auth: {
          user: demandeur,
          pass: smtpPass,
        },
      });
      const mailOption = {
        from: demandeur,
        to: process.env.GLPI_EMAIL,
        subject: "Demande de prêt",
        text: `Demandeur: ${demandeur}
Service: ${service}
Date début prêt: ${lendDateStart}
Date fin prêt: ${lendDateEnd}


Besoins:
  PC fixe: ${isUndefined(needComputer)}
  PC portable: ${isUndefined(needPortableComputer)}
  Clavier / Souris: ${isUndefined(needKBM)}
  Écran: ${isUndefined(needScreen)}
  Casque audio: ${isUndefined(needHeadphones)}
  Téléphone mobile: ${isUndefined(needMobilePhone)}


Commentaires:
${comment}
          `,
      };
      try {
        await transporter.sendMail(mailOption);
        return Promise.resolve("Message Sent Successfully!");
      } catch (error) {
        console.log(error)
        return Promise.reject(error);
      }
  }
}