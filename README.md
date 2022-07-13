# Projet Challenge - Groupe 2

# Le concept

Le but du projet est de créer une application permettant de challenger des étudiant sur des technologies étudier dans l'année

# Celle-ci se compose de 2 parties:

  - Une partie Administrateur permettant a l'intervenant de créer et gérer les différents challenge
  - Une partie "Étudiant" qui se compose de l'inscription ainsi que le lancement du challenge


# La base de données

![image](https://user-images.githubusercontent.com/75838045/178742331-94ee254f-e3a4-482a-9587-4192ec1113a4.png)

# Les différents parcours utilisateur

![image](https://user-images.githubusercontent.com/75838045/178742382-09fc22b7-920e-4050-b543-3fd3fe2a0561.png)

# Les technologies utilisées

# API
  - NodeJS
  - ExpressJS
  - Typescript
  - TSOA w/ Swagger
  
# Front
  - ReactJS
  - Typescript
  - Mantine
  
# Lancer le projet en local

API
Déployé ici: http://20.216.173.163:5050/

Lancez VSCode, et accepter de ré-ouvrir le projet dans un Dev Container.

Ouvrir un terminal (il s'ouvre directment dans le container de l'api).

# Se connecter a la base données

mycli -h back-dbms-1 -u root -D mtdb
# Ensuite, utilisez le mot de passe dans .env.dev
Afin de lancer le serveur de développement:

# A faire une fois avant le premier lancement
npm install

# Pour lancer l'API
npm run api
L'API est accessible à l'adresse: http://localhost:5050.

Accéder a la documentation swagger: http://localhost:5050/docs/swagger.json.

Front
Déployé ici: https://g2-api-challenge.netlify.app/

Lancer le serveur de développement:

npm install

npm run dev
Se rendre sur http://localhost:3000.

Les questions du challenge
Le document détaillé du challenge est disponible dans le QuestionsChallenge.md
