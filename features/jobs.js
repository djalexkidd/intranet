// Création d'une fonction asynchrone pour les offres d'emploi
module.exports = {
    dataJobs: async function () {
            const STRAPI_IP = "http://127.0.0.1:1337/api/jobs"
            const reponse = await fetch(STRAPI_IP)
            const jobs = await reponse.json()

            return jobs
    }
}