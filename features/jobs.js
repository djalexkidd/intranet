const STRAPI_IP = "http://127.0.0.1:1337/api/jobs/"
const STRAPI_LOGIN = "http://127.0.0.1:1337/api/auth/local/"

module.exports = {
    dataJobs: async function () {
        // Liste des offres d'emploi
        const reponse = await fetch(STRAPI_IP)
        const jobs = await reponse.json()

        return jobs
    },
    submitJob: async function (jobName, jobDetails, jwt) {
        // Envoi d'une offre d'emploi
        const reponse = await fetch(STRAPI_IP, {
            method: "POST",
            headers: { "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt },
            body: JSON.stringify({
            data: {
                "name": jobName,
                "details": jobDetails
            }
            })
        })
    },
    viewJob: async function (jobId) {
        // Visionnage d'une offre d'emploi
        const reponse = await fetch(STRAPI_IP + jobId)
        const job = await reponse.json()

        return job
    },
    deleteJob: async function (jobId, jwt) {
        // Suppression d'une offre d'emploi
        const reponse = await fetch(STRAPI_IP + jobId, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + jwt }
        })
    },
    editJob: async function (jobId, jobName, jobDetails, jwt) {
        // Modification d'une offre d'emploi
        const reponse = await fetch(STRAPI_IP + jobId, {
            method: "PUT",
            headers: { "Content-Type": "application/json",
            "Authorization": "Bearer " + jwt },
            body: JSON.stringify({
            data: {
                "name": jobName,
                "details": jobDetails
            }
            })
        })
    },
    strapiConnect: async function (password, res, email) {
        // Connexion de l'utilisateur
        const reponse = await fetch(STRAPI_LOGIN, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "identifier": email,
                "password": password
            })
        })
        const data = await reponse.json()

        if (data.jwt != null) {
            res.cookie("jwt", data.jwt)
            res.redirect('/jobs')
        } else {
            res.render("loginjob.ejs", {
                error: "Nom d'utilisateur ou mot de passe incorrect.",
                useremail: email
            });
        }
    }
}