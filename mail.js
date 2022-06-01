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
    mainMail: async function (lastname, firstname, birthdate, matricule, service, fonction, persontype, needMail, needComputer, needPhone, needMobilePhone) {
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
        from: process.env.GLPI_SENDER,
        to: process.env.GLPI_EMAIL,
        subject: "Nouveau salarié",
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
}