const nodeMail = require("nodemailer");

// Fonction asynchrone pour l'envoi du formulaire
module.exports = {
    mainMail: async function (smtpUser, smtpPass, smtpName, smtpMail, offerId, userTel) {
      const transporter = await nodeMail.createTransport({
        service: "Outlook365",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      const mailOption = {
        from: smtpName + " <" + smtpMail + ">",
        to: process.env.JOB_EMAIL,
        subject: "Proposition candidat",
        text: `Numéro de l'offre: #${offerId}
Candidat: ${smtpName}
E-mail: ${smtpUser}
Téléphone: ${userTel}`,
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