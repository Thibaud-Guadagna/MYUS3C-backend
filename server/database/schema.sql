-- Création de la table des utilisateurs du système
CREATE TABLE system_users (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(150) NOT NULL,
    is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Insertion d’un super administrateur initial
INSERT INTO system_users (firstname, lastname, email, password, is_superadmin, is_admin, is_active)
VALUES ('thibaud', 'guadagna', 'thibaud.guadagna@gmail.com', 'thibaud', TRUE, FALSE, TRUE);


-- Création de la table des équipes sportives
CREATE TABLE sports_teams (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    number_of_players INT
);


-- Création de la table des catégories de joueurs
CREATE TABLE player_categories (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    users_created INT NOT NULL,
    FOREIGN KEY (users_created) REFERENCES system_users(id)
);


-- Création de la table des joueurs
CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(150) NOT NULL,
    lastname VARCHAR(150) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES player_categories(id)
);


-- Création de la table des statistiques des joueurs
CREATE TABLE player_statistics (
    player_id INT,
    team_id INT,
    goals_scored INT,
    matches_played INT,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES sports_teams(id)
);
