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
    <br>
    <br>
    Besoins:
    <br>
    Adresse mail: ${isUndefined(needMail)}
    <br>
    PC fixe: ${isUndefined(needComputer)}
    <br>
    PC portable: ${isUndefined(needPortableComputer)}
    <br>
    Téléphone fixe: ${isUndefined(needPhone)}
    <br>
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
        host: process.env.SMTP_SERVER,
        port: process.env.SMTP_PORT,
        auth: {
          user: smtpUser,
          pass: smtpPass,
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
          Service: ${service}
          <br>
          Fonction: ${fonction}
          <br>
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