import type { Request, Response } from "express";
import jwt, { sign } from "jsonwebtoken";
import userRepository from "../user/userRepository";

const tokenKey = process.env.JWT_SECRET;
if (!tokenKey) {
  throw new Error("La clé secrète du token n'est pas définie dans le .env");
}

// Fonction asynchrone de connexion d'un utilisateur (login)
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const signIn = async (request: Request, response: Response): Promise<any> => {
  // Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
  const { mail, password } = request.body;
  // Appel du repository pour vérifier si un utilisateur existe dans la base de donnees
  const user = await userRepository.signIn(mail, password);

  if (!user) {
    // Si l'utilisateur n'existe pas ou que les identifiants sont incorrects, on envoie une erreur 401 au client
    return response
      .status(401)
      .send({ message: "Cet utilisateur n'existe pas" });
  }

  // Si un user est trouvé, récupération du token de l'utilisateur
  const userId = user.id;
  const token = jwt.sign({ id: userId }, tokenKey);
  // Envoie au client un message de succes, le token dauthentification (JWT) et l'identifiant du nouvel utilisateur
  response.send({
    message: "Utilisateur connecté",
    token: token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      mail: user.mail,
      is_admin: Boolean(user.is_admin),
      is_actif: Boolean(user.is_actif),
    },
  });
};

// Fonction asynchrone de creation dun utilisateur (inscription)
const signUp = async (request: Request, response: Response): Promise<any> => {
  // Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
  const { firstname, lastname, mail, password } = request.body;
  // Appel du repository pour creer un utilisateur dans la base de donnees
  const userId = await userRepository.create({
    firstname,
    lastname,
    mail,
    password,
    is_superadmin: false,
    is_admin: false, // Par défaut, les nouveaux utilisateurs ne sont pas administrateurs
    is_actif: true, // Par défaut, les nouveaux utilisateurs sont actifs
  });
  // Si la creation echoue (retour falsy), on envoie une erreur 400 au client
  if (!userId) {
    return response
      .status(400)
      .send({ message: "Erreur dans la création de l'utilisateur" });
  }
  // Récupérer le user fraîchement créé (important !)
  const user = await userRepository.signIn(mail, password);

  if (!user) {
    return response
      .status(500)
      .send({ message: "Utilisateur créé mais non retrouvé" });
  }
  // Si un user est cree, un token lui est attribue qui permet de l'identifier lors des futures requetes
  const token = jwt.sign({ id: userId }, tokenKey);
  // Envoie au client un message de succees, le token dauthentification (JWT) et l'identifiant du nouvel utilisateur
  // Renvoyer tout l'objet user + token
  response.send({
    ...user,
    token,
  });
};

export default { signIn, signUp }