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

// Fonction s'activant si la personne est indirecte, affichant les besoins de la personne ou non
function isIndirectPerson(persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone) {
  if (persontype === "externe") {
    return `


Besoins:
  Adresse mail: ${isUndefined(needMail)}
  PC fixe: ${isUndefined(needComputer)}
  PC portable: ${isUndefined(needPortableComputer)}
  Téléphone fixe: ${isUndefined(needPhone)}
  Téléphone mobile: ${isUndefined(needMobilePhone)}`
  }
  else {
    return ""
  }
}

// Fonction asynchrone pour l'envoi du formulaire
module.exports = {
    mainMail: async function (lastname, firstname, birthdate, service, fonction, persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone, smtpUser, smtpPass) {
      const transporter = await nodeMail.createTransport({
        service: "Outlook365",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      const mailOption = {
        from: smtpUser,
        to: process.env.GLPI_EMAIL,
        subject: "Nouveau salarié",
        text: `Nom: ${lastname}
Prénom: ${firstname}
Date de naissance: ${birthdate}
Service: ${service}
Fonction: ${fonction}
Personne ${persontype}
          ${isIndirectPerson(persontype, needMail, needComputer, needPortableComputer, needPhone, needMobilePhone)}`,
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