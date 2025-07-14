import type { Result, Rows } from "../../../database/client";
import databaseClient from "../../../database/client";


type User = {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  is_superadmin: boolean;
  is_admin: boolean;
  is_actif: boolean;
};

class userRepository {
  // Le C du CRUD - CREATE
  async create(user: Omit<User, "id">) {
    try {
      // Création d'un nouveau user dans la base de données
      const [result] = await databaseClient.query<Result>(
        "INSERT INTO users (firstname, lastname, mail, password, is_superadmin, is_admin, is_actif) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          user.firstname,
          user.lastname,
          user.mail,
          user.password,
          user.is_superadmin,
          user.is_admin,
          user.is_actif,
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
      "UPDATE Users set firstname = ?, lastname = ?, mail = ?, is_superadmin = ?, is_admin = ?, is_actif = ?, abonnement_id = ? WHERE id = ?",
      [
        user.firstname,
        user.lastname,
        user.mail,
        user.is_superadmin,
        user.is_admin,
        user.is_actif,
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
    async signIn(mail: string, password: string) {
    // Exécute la requête SQL pour lire un utilisateur par son mail et mot de passe
    const [rows] = await databaseClient.query<Rows>(
      "select * FROM Users where mail = ? AND password = ?",
      [mail, password],
    );
    //Retourne la première ligne du résultat de la requête ou undefined si aucun utilisateur n'est trouvé
    return rows[0] as User | undefined;
  }
}
export default new userRepository;