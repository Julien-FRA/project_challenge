[[_TOC_]]

# Documentation

Notre API doit être facilement compréhensible pour ses utilisateurs. On pourrait manuellement écrire une documentation, mais :
* il est difficile de le garder à jour, on est souvent faignant, ou en retard
* Une petite modification au code pourrait modifier le comportement documenté

Un standard de documentation qui s'appelle `swagger` et depuis peu [`openapi`](https://www.openapis.org) a crée une norme pour la documentation d'une api. La documentation est en form `.json` et peu être lu est interprété par un autre process. Il y a même des [process qui transforment automatiquement un fichier `swagger` en interface HTML pour notre lecture](https://swagger.io/tools/swagger-ui/). 

Il y a plusieurs façons de documenter un API :
* Définition vers code : on rédige notre `swagger.yml` ou `swagger.json` manuellement, et puis on fait tourner un processus qui va créer des fonctions/classes/endpoints pour notre architecture cible (nodejs, php, ruby... etc). Le fichier `swagger.*` est la source de vérité de l'application.
    * Personnellement, je n'aime pas cet approche, car le code généré est très repetitif, et parfois pas assez flexible pour ce que je veux faire
    * Parfois on oublie que le fichier swagger est la source de vérité. On ajoute des fonctions, qui seront décroché ou bien supprimer plus tard quand on relance le générateur.
* Code ver la définition : on fait une sorte de bien structurer et documenter notre code (avec de commentaire), et un `swagger.*` fichier est crée de notre code. Notre code devient la source de vérité.
* Manuel : on maintien la doc et l'implémentation indépendamment. Très lourd, et facile à oublier ou de ne pas mettre à jour.

Personnellement,on aura une seule source de vérité : notre code source !

Grâce à Typescript, il y a des projets comme [`tsoa`](https://tsoa-community.github.io/docs/) qui permet d'utiliser la structure Typescript et les commentaires déjà présents dans le code afin d'assembler automatiquement la documentation.

Par contre, `tsoa` est un framework qui est _opinionated_. On est obligé de structurer notre code à leur normes pour que la documentation soit cohérent :
* __Orienté objet__ : on précise un objet par endpoint avec des fonctions dedans pour les opérations type CRUD - cet objet est un `Controller` dans le pattern MVC.
* __Décorateurs__ : on utilise les décorateurs de typescript pour apporter de l'information concernant les routes, paramètres etc
* __Routing est opaque__ : au lieu de créer des routes nous même (comme dans le dernier exemple), on laisse `tsoa` construire notre API dans express selon les décorateurs. C'est le seul point que je n'aime pas, mais l'avantage d'avoir un documentation cohérent equilibre ce désavantage.

Mince ! On est allé un peu trop loin de la refactoring de notre code - il faudrait repasser un modèle orienté objet.

## Installer `tsoa`

Installer `tsoa` (TypeScript Open Api) :

```
npm install tsoa
```

Dans `tsconfig.json` il faut activer l'usage des décorateurs TypeScript : 

```json
 "experimentalDecorators": true,                   /* Enable experimental support for TC39 stage 2 draft decorators. */
```

## Un objet et ses décorateurs

[Créer un objet User](../../src/routes/auth/UserController.ts)

* Réutilisation de notre class `Crud.ts`
* Décorateurs `@Route`, `@Query`, `@Path`, `@Body`, `@Middlewares`

## Configurer tsoa

[Configurer tsoa](../../tsoa.json)

* On précise `spec.outputDirectory` pour le fichier avec notre documentation. On le met dans le dossier public qui sera servi comme fichier static
* On précise `routes.routesDir` pour la destination de notre routeur Express.
   
* [Creation d'un script qui génère des routes Express et de la documentation](../../package.json)

```json
  /* package.json */

  ...
  "scripts": {
    "api": "nodemon",
    "swagger": "tsoa spec-and-routes",
```

* Générer la doc et les routes :

```sh
# terminal vscode

npm run swagger

# Les fichiers seront crées :
# - public/swagger.json
# - routes/routes.ts
```


* [Inclusion des routes dans api.ts](../../src/api.ts)

```ts
// api.ts
...
import { RegisterRoutes } from './routes/routes';
...
RegisterRoutes(app);

```

## Voir la documentation

[Inclure le dossier public sous docs](../../src/api.ts)

```ts
// api.ts

...
app.use(Express.static("public"));
...

```

En lançant l'api, le fichier `swagger.json` est disponible à [http://localhost:5050/swagger.json](http://localhost:5050/swagger.json).

[Inclusion d'un générateur de documentation HTML](../../src/api.ts)
  * Installer [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
      * `npm install swagger-ui-express` 
      * `npm install --save-dev @types/swagger-ui-express`
  * Ajouter un handler pour la génération des docs

```ts
// api.ts

...
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
...

```

## Sécurisation

* [Gérer l'autorisation](../../src/auth/authentication.ts)
* [Préciser l'autorisation dans tsoa.json](../../tsoa.json)
* [Ajouter de la sécurisation aux endpoints avec @Security](../../src/routes/auth/UserController.ts)

## Environnement de dev

[Configurer nodemon pour reconstruire l'api et doc à chaque modification](../../nodemon.json)

## Environnement de prod

D'abord, préciser `outdir` dans `tsconfig.json`. C'est le dossier où se trouve notre projet compilé et à déployer: 

```json
/* tsconfig.json */

  ...
  "outDir": "./build",                                   /* Specify an output folder for all emitted files. */
```


```
# outil pour la suppression de fichiers et dossiers
npm install --save-dev rimraf

# outil pour copier les fichiers et dossiers
npm install --save-dev copyfiles
```

Dans package.json :

```json
 /* package.json */

  ...
  "scripts": {
    "api": "nodemon",
    "swagger": "tsoa spec-and-routes",
    /* Supprimer l'ancien build */
    "clean": "rimraf build",
    /* Clean, puis générer les fichiers swagger et routes, puis compiler avec tsc, puis copier le dossier public dans build */
    "build": "npm run clean && npm run swagger && tsc && copyfiles public/**/* build/"
  },

```

Pour compiler une version de déploiement, il faut juste émettre dans le terminal :
```
npm run build
```