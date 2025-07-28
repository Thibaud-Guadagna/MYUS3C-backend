import type { Result, Rows } from "../../../database/client";
import databaseClient from "../../../database/client";
import { count, error } from "node:console";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";

type User = {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password?: string;
	is_superadmin: boolean;
	is_admin: boolean;
	is_active: boolean;
};
export type WaitingUserToCreate = {
	firstname: string;
	lastname: string;
	email: string;
	passHash: string; // Hashed password
	license_number: string;
	trained_category_id: number;
};

export interface WaitingUser extends RowDataPacket {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	license_number: string;
	trained_category_name: string;
	is_admin: boolean;
	is_superadmin: boolean;
	is_active: boolean;
}

class userRepository {
	// Le C du CRUD - CREATE
	async create(user: Omit<User, "id">) {
		try {
			// Création d'un nouveau user dans la base de données
			const [result] = await databaseClient.query<Result>(
				"INSERT INTO users (firstname, lastname, email, password, is_superadmin, is_admin, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					user.firstname,
					user.lastname,
					user.email,
					user.password,
					user.is_superadmin,
					user.is_admin,
					user.is_active,
				],
			);
			// Retourne l'ID du nouveau user inséré
			console.log("Utilisateur inséré avec ID :", result.insertId);
			return result.insertId;
		} catch (error) {
			console.error("Erreur d'insertion dans la base :", error);
			throw error; // si la requête échoue, on relance l'erreur
		}
	}

	// Le R du CRUD
	async read(id: number) {
		//Exécute la requête SQL pour lire une information par son id
		const [rows] = await databaseClient.query<Rows>(
			"select * from users where id = ?",
			[id],
		);
		//Retourne la première ligne du résultat de la requête
		return rows[0] as User;
	}
	async readAll() {
		// Exécute la requête SQL pour lire tout le tableau de la table "Users"
		const [rows] = await databaseClient.query<Rows>("select * from users");
		// Retournes le tableau d'éléments
		return rows as User[];
	}

	//   Le U du CRUD - Update
	async update(user: User) {
		// Exécute la requête SQL pour lire tout le tableau de la table "User"
		const [result] = await databaseClient.query<Result>(
			"UPDATE Users set firstname = ?, lastname = ?, email = ?, is_superadmin = ?, is_admin = ?, is_actif = ?, WHERE id = ?",
			[
				user.firstname,
				user.lastname,
				user.email,
				user.is_superadmin,
				user.is_admin,
				user.is_active,
				user.id,
			],
		);
		// Retourne le tableau des users mis à jour
		return result.affectedRows;
	}
	// Le D du CRUD
	async delete(id: number) {
		// Exécute la requête SQL pour supprimer un user spécifique par son ID
		const [result] = await databaseClient.query<Result>(
			"DELETE FROM Users WHERE id= ?",
			[id],
		);
		// Retourne le nombre de lignes affectées par la suppression

		return result.affectedRows;
	}
	//Fonction de Connexion
	async signIn(email: string) {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT * FROM users WHERE email = ?",
			[email],
		);

		return rows[0] as User | undefined;
	}
	async signUp(waitingUserId: number) {
		// Récupère le user en attente depuis la base

		const [rows] = await databaseClient.query<WaitingUser[]>(
			"SELECT * FROM waiting_users WHERE id = ?",
			[waitingUserId],
		);

		const user = rows[0];

		if (user) {
			const is_superadmin = false;
			const is_admin = false;
			const is_active = true;
			const [result] = await databaseClient.query<Result>(
				"INSERT INTO users (firstname, lastname, email, password, is_superadmin, is_admin, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[
					user.firstname,
					user.lastname,
					user.email,
					user.password,
					is_superadmin,
					is_admin,
					is_active

				],
			);
			
			await databaseClient.query("DELETE FROM waiting_users WHERE id = ?", [
				waitingUserId,
			]);
			console.log("Utilisateur crée et supprimé de la liste d'attente", user)
			// Retourne l'ID du nouvel utilisateur inséré
			return { id: result.insertId, email: user.email };
		} else {
			throw new Error("Utilisateur non trouvé dans la table wainting_users");
		}
	}

	//Fonction de creation d'un user fictif en attente de validation
	async askAccessDb(waitingUser: Omit<WaitingUserToCreate, "id">) {
		try {
			const [result] = await databaseClient.query<Result>(
				`INSERT INTO waiting_users 
        (firstname, lastname, email, password, license_number, trained_category_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
				[
					waitingUser.firstname,
					waitingUser.lastname,
					waitingUser.email,
					waitingUser.passHash,
					waitingUser.license_number,
					waitingUser.trained_category_id,
				],
			);
			console.log("Utilisateur en attente", result.insertId);
			return result.insertId;
		} catch (error) {
			console.error(
				"Erreur lors de la mise en attente de l'utilisateur",
				error,
			);
			throw error;
		}
	}
	async waitingList() {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT COUNT(*) FROM waiting_users",
		);
		const count = rows[0]["COUNT(*)"];
		return { count };
	}
	async waitingInfo() {
		const [rows] = await databaseClient.query<Rows>(
			"SELECT wu.id, wu.firstname, wu.lastname, wu.email, wu.license_number, pc.name as trained_category_name FROM waiting_users wu JOIN player_categories pc ON wu.trained_category_id = pc.id",
		);
		return rows as WaitingUser[];
	}
	async deleteWaitingUser(id: number) {
		const [result] = await databaseClient.query(
			"DELETE FROM waiting_users WHERE id = ?",
			[id],
		);
	}
}
export default new userRepository();
