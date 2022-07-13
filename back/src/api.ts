import Express, { json } from "express";
import swaggerUi from "swagger-ui-express";
import { requestLogMiddleware } from './classes/Logging/LoggingMiddleware';
import { DefaultErrorHandler } from './middleware/error-handler';
import { RegisterRoutes } from './routes/routes';
import { Log } from './classes/Logging/Log';
import cors from 'cors';

// Récupérer le port des variables d'environnement ou préciser une valeur par défaut
const PORT = process.env.PORT || 5050;

// Créer l'objet Express
const app = Express();

// Add a list of allowed origins
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

// Autoriser les urls a appeler l'API
app.use(cors(options));

// L'appli parse le corps du message entrant comme du json
app.use(json());

// Utiliser un middleware pour créer des logs
app.use(requestLogMiddleware('req'));

// Les routes de tsoa
RegisterRoutes(app);

// Ajouter un handler pour les erreurs
app.use(DefaultErrorHandler);

app.use(Express.static("public"));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);


// Lancer le serveur
app.listen(PORT,
  () => {
    Log(`API Listening on port ${PORT}`)
  }
);


