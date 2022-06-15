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
    mainMail: async function (demandeur, service, lendDateStart, lendDateEnd, needComputer, needPortableComputer, needKBM, needScreen, needHeadphones, needMobilePhone, comment) {
      const transporter = await nodeMail.createTransport({
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      const mailOption = {
        from: process.env.GLPI_SENDER,
        to: process.env.GLPI_EMAIL,
        subject: "Demande de prêt",
        html: `Demandeur: ${demandeur}
          <br>
          Service: ${service}
          <br>
          Date début prêt: ${lendDateStart}
          <br>
          Date fin prêt: ${lendDateEnd}
          <br>
          <br>
          Besoins:
          <br>
          PC fixe: ${isUndefined(needComputer)}
          <br>
          PC portable: ${isUndefined(needPortableComputer)}
          <br>
          Clavier / Souris: ${isUndefined(needKBM)}
          <br>
          Écran: ${isUndefined(needScreen)}
          <br>
          Casque audio: ${isUndefined(needHeadphones)}
          <br>
          Téléphone mobile: ${isUndefined(needMobilePhone)}
          <br>
          <br>
          Commentaires:
          <br>
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