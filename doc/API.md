# Utilisation des API

Pour manipuler les données des API j'ai utilisé la fonction ```fetch``` de JavaScript.

## Endpoints

Exemple d'utilisation : ```const APICALL = "http://localhost:1337/api/hosts"```

```GET /api/hosts``` : Liste des signets

```GET /api/jobs``` : Offres d'emploi

## Liste des attributs

### Signets

```host.data.attributes.name``` : Nom du signet

```host.data.attributes.ip``` : URL/IP du signet

### Utilisateurs

```user.cn``` : Nom complet

```user.userPrincipalName``` : Adresse e-mail

```user.telephoneNumber``` : Numéro de téléphone

```user.otherTelephone``` : Numéro de téléphone mobile

```user.ipPhone``` : Numéro abrégé (téléphone IP)

```user.title``` : Fonction

### Offres d'emploi

```job.data.attributes.name``` : Nom de l'offre

```job.data.attributes.details``` : Contenu de l'offre