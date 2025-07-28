//Importe le framework express pour créer un serveur HTTP
import cors from "cors";// Importe le middleware CORS (Cross-Origin Resource Sharing)
import express from "express";
import router from "./router"; //j'importe mon router

// Initialise une instance de l'application Express
const app = express();

// ✅ Active CORS en premier
if (process.env.CLIENT_URL != null) {	// Si une URL est définie dans les variables d'environnement (ex: .env)
  app.use(cors({ origin: [process.env.CLIENT_URL] }));// alors autorise uniquement cette origine pour les appels API (ex: http://localhost:4200)
}

app.use(express.json()); // Active le middleware intégré d'Express pour parser les requêtes JSON (req.body), très utile pour les routes POST/PUT avec des données JSON

app.use(express.urlencoded({ extended: true })); // Active le parsing des données de type 'application utilisé principalement pour les formulaires HTML (ex: <form method="POST">)
// L'option extended: true permet de parser des objets/niveaux imbriqués (utilise la lib qs)

app.use(express.text()); // Active le parsing des données de type 'text/plain' Utile si tu attends du texte brut dans le corps de la requête (ex: contenu d'un éditeur, webhook) Résultat : req.body sera une string

app.use(express.raw()); // Active le parsing du corps brut de la requête (sous forme de Buffer) Recommandé si tu dois traiter des données binaires ou vérifier une signature (ex: webhook Stripe)
// Résultat : req.body sera un Buffer (non transformé)

app.use('/api', router);

app.get("*", async (_req, res) => {
	res.send("Hello from MYUS3C backend with TypeScript!");
});

//Gestion des erreurs

import type { ErrorRequestHandler } from "express"; // import du type ErrorRequestHandler de Express

const logErrors: ErrorRequestHandler = (err, req, _res, next) => {
	// Déclare un middleware pour logger les erreurs rencontrées dans l'application qui doit avoir 4 paramètres (err, req, res, next) pour qu'Express le reconnaisse comme un middleware d'erreur

	console.error(err); //Affiche dans la console l'objet de l'erreur
	console.error("Sur la requête:", req.method, req.path); //Affiche le contexte de la requête : methode HTTP et chemin

	next(err); //On transmet l'erreur  au middleware suivant dans la chaîne et obligatoire pour ne pas interrompre le flux de traittement d'express et on permet à un autre middleware de formater la réponse
};

app.use(logErrors); //utilisation de la fonction dans l'app

export default app;
