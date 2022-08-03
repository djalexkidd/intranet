# Configuration du site web

Toutes les variables d'environnement se situent dans le fichier ```.env``` à la racine du projet, si le fichier n'existe pas vous pouvez le créer en vous basant sur le fichier d'exemple (```.env.example```).

Voici un exemple de configuration :

```
[GÉNÉRAL]
PORT=3000                                   --- Port d'écoute
DOMAIN_NAME=domain.com                      --- Nom de domaine

[PAGE D'ACCUEIL]
WEATHER_APIKEY=0                            --- Clé API de openweathermap.org pour la météo

[FORMULAIRE MAIL]
GLPI_EMAIL=ticket@domain.com                --- Adresse email de destination

[LISTE UTILISATEURS ACTIVE DIRECTORY]
AD_SERVER=ldap://dc.domain.com              --- Adresse IP de l'Active Directory
AD_BASEDN=ou=services,dc=domain,dc=com      --- Domaine racine

[SÉCURITÉ]
SSL=false                                   --- Utiliser HTTPS
SSL_KEY=/usr/local/ssl/key.pem              --- Chemin de la clé
SSL_CERT=/usr/local/ssl/cert.pem            --- Chemin du certificat
```