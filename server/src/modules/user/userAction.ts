import type { RequestHandler } from "express";//Accès à la BDD

import userRepository from "./userRepository";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  mail: string;
  password: string;
  is_superadmin: boolean;
  is_admin: boolean;
  is_actif: boolean;
};

//Le B DU Bread (Read All)
const browse: RequestHandler = async (req, res, next) => {
  try {
    //Fetch des users
    const user = await userRepository.readAll();
    //réponse des informations du user au format JSON
    res.json(user);
  } catch (err) {
    //Transmission des erreurs au middleware pour gestion des erreurs
    next(err);
  }
};
// Le R du BREAD - Lis la requête
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch via ID d'un élement de la table User
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    // Si l'élément est introuvable, on répond avec une page 404
    // Sinon, on répond avec l'élément en JSON
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};
// Le E du BREAD

const edit: RequestHandler = async (req, res, next) => {
  try {
    //Mettre à jour une information spécifique en fonction de l'ID fourni
    const user = {
      id: Number(req.params.id),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      is_superadmin: req.body.is_superadmin,
      is_admin: req.body.is_admin,
      is_actif: req.body.is_actif,
      
    };
    const affectedRows = await userRepository.update(user);
    // Si l'information n'est pas trouvée, répondre avec statut 404
    //Sinon répondre avec l'information au format JSON
    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Transmission de toute erreur au middleware pour gestion des erreurs
    next(err);
  }
};

// Le A de BREAD - Créer une opération
const add: RequestHandler = async (req, res, next) => {
  try {
    // On extrait les donnés de l'élément du corps de la requête
    const newUser: Omit<User, "id"> = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      mail: req.body.mail,
      password: req.body.password,
      is_superadmin: req.body.is_superadmin,
      is_admin: req.body.is_admin,
      is_actif: req.body.is_actif,
    
    };
    // Création d'un user
    const insertId = await userRepository.create(newUser);

    // On répond avec http 201 (crée) et l'id de l'élément nouvellment inséré
    res.status(201).json({ insertId });
  } catch (err) {
    // On transmet toutes les erreurs au middlexare de gestion des erreurs
    next(err);
  }
};

// Le D de Destroyu du BREAD - Supprime un élément
const destroy: RequestHandler = async (req, res, next) => {
  try {
    //Supprime un élément spécifique en fonction de l'ID fourni
    const userId = Number(req.params.id);
    await userRepository.delete(userId);
    // Répondre quand avec un statut HTTP 204 (Requête correcte mais pas de corps de réponse à afficher)
    res.sendStatus(204);
  } catch (err) {
    // Transmettez toutes les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

export default {
    browse,
    read,
    edit,
    add,
    destroy,
};