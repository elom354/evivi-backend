# MiddleOffice-Xflow

## Documentation

- [Contribution](docs/contribution.md)

## Cloner le projet

Pour cloner le projet et l'ensemble de ses sous-modules, exécuter la commande :

```sh
git clone https://github.com/elom354/backend-irfo-academic.git
```

## Prise en main

Pour bien démarrer sur le projet, se référer au fichier `.nvmrc` pour connaître et installer la bonne version de Node.js.

Installer les dépendences :

```sh
npm install
```

## Variable d'environnement

Définir les variables d'environnement en créant un fichier .env à partir du fichier .env.sample.

L'application se partage différentes librairies se trouvant dans le dossier `libs`.

## Base de données

Le projet requiert que MongoDB soit installé.

## Lancer les applications

### L'Admin Api

```sh
# development mode
$ npm run start:api

# watch mode
$ npm run start:api:dev

# debug mode
$ npm run start:api:debug

# production mode
$ npm run start:api:prod
```
