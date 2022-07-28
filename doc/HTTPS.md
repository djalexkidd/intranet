# Configuration de HTTPS

HTTPS est la combinaison du HTTP avec une couche de chiffrement comme SSL ou TLS. Ça permet d'éviter qu'un attaquant puisse intercepter les identifiants dans un formulaire par exemple.

1. Tout d'abord, générez un fichier de clé utilisé pour la génération de certificats auto-signés avec la commande ci-dessous. La commande créera une clé privée sous la forme d'un fichier appelé key.pem.

```
openssl genrsa -out key.pem
```

2. Ensuite, générez une demande de service de certificat (CSR) avec la commande ci-dessous. Vous aurez besoin d'un CSR pour fournir toutes les entrées nécessaires à la création du certificat réel.

```
openssl req -new -key key.pem -out csr.pem
```

3. Enfin, générez votre certificat en fournissant la clé privée créée pour le signer avec la clé publique créée à l'étape 2 avec une date d'expiration de 365 jours. Cette commande ci-dessous créera un certificat appelé cert.pem.

```
openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
```

4. Activez SSL et spécifiez la clé et le certificat dans le fichier de configuration (```.env```).

```
SSL=true
SSL_KEY=key.pem
SSL_CERT=cert.pem
```