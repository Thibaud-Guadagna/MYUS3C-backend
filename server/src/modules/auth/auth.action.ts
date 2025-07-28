import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";
import type { WaitingUser } from "../user/userRepository";

const tokenKey = process.env.JWT_SECRET;
if (!tokenKey) {
	throw new Error("La clé secrète du token n'est pas définie dans le .env");
}

// Fonction asynchrone de connexion d'un utilisateur (login)

const signIn = async (request: Request, response: Response): Promise<void> => {
	// Récupération des données envoyées depuis le client via le formulaire et insertion dans le corps de la requête
	const { email, password } = request.body;
	// Appel du repository pour vérifier si un utilisateur existe dans la base de donnees
	const user = await userRepository.signIn(email);

	if (!user) {
		response.status(401).send({ message: "Cet utilisateur n'existe pas" }); // Si l'utilisateur n'existe pas ou que les identifiants sont incorrects, on envoie une erreur 401 au client
		return;
	}
	const isPasswordValid = bcrypt.compareSync(password, user.password || "");

	console.log("isPasswordValid", isPasswordValid, password, user.password);

	// Si le mot de passe est incorrect, renvoyer une erreur 401
	if (!isPasswordValid) {
		response.status(401).send({ message: "Mot de passe incorrect" });
		return;
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
			email: user.email,
			is_admin: Boolean(user.is_admin),
			is_actif: Boolean(user.is_active),
		},
	});
};

// Fonction asynchrone de creation dun utilisateur (inscription)
const signUp = async (request: Request, response: Response): Promise<void> => {
	const { waitingUserId } = request.body;
	// Appel du repository pour creer un utilisateur dans la base de donnees

	const { id: userId, email } = await userRepository.signUp(waitingUserId);
	// Si la creation echoue (retour falsy), on envoie une erreur 400 au client
	if (!userId) {
		response
			.status(400)
			.send({ message: "Erreur dans la création de l'utilisateur" });
		return;
	}
	// Récupérer le user fraîchement créé (important !)
	const user = await userRepository.signIn(email);

	if (!user) {
		response
			.status(500)
			.send({ message: "Utilisateur créé mais non retrouvé" });
		return;
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
const askAcess = async (
	request: Request,
	response: Response,
): Promise<void> => {
	const {
		firstname,
		lastname,
		email,
		password,
		license_number,
		trained_category_id,
	} = request.body;
	const passHash = bcrypt.hashSync(password, 8);

	const waitingUser = await userRepository.askAccessDb({
		firstname,
		lastname,
		email,
		passHash,
		license_number,
		trained_category_id,
	});

	if (!waitingUser) {
		response.status(400).send({ message: "Aucun utilisateur en attente" });
	} else {
		response.status(201).send({ message: `Demande d'accès enregistrée` });
	}
};


export default { signIn, signUp, askAcess };
