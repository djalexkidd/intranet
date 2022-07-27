const STRAPI_IP = "http://127.0.0.1:1337/api/jobs/"

module.exports = {
    dataJobs: async function () {
        // Liste des offres d'emploi
        const reponse = await fetch(STRAPI_IP)
        const jobs = await reponse.json()

        return jobs
    },
    submitJob: async function (jobName, jobDetails) {
        // Envoi d'une offre d'emploi
        const reponse = await fetch(STRAPI_IP, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    deleteJob: async function (jobId) {
        // Suppression d'une offre d'emploi
        const reponse = await fetch(STRAPI_IP + jobId, {
            method: "DELETE"
        })
    }
}