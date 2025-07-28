-- Création de la table des utilisateurs du système
CREATE TABLE users (
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
INSERT INTO users (id, firstname, lastname, email, password, is_superadmin, is_admin, is_active)
VALUES (1, 'THIBAUD', 'GUADAGNA', 'thibaud.guadagna@gmail.com', 'thibaud', TRUE, FALSE, TRUE);

-- Création de la table des catégories de joueurs
CREATE TABLE player_categories (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL
);

INSERT INTO player_categories ( id, name)
VALUES 
(1, 'U6'),
(2, 'U7'),
(3, 'U8'),
(4, 'U9'),
(5, 'U10'),
(6, 'U11'),
(7, 'U12'),
(8, 'U13'),
(9, 'U14'),
(10, 'U15'),
(11, 'U16'),
(12, 'U17'),
(13, 'U18'),
(14, 'Seniors');


-- Insertion d'une table d'utilisateur attendant un accès
CREATE TABLE waiting_users (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(150) NOT NULL,            
    lastname VARCHAR(150) NOT NULL,              
    email VARCHAR(150) NOT NULL,                
    password VARCHAR(150) NOT NULL,              
    license_number VARCHAR(50) NOT NULL,      
    trained_category_id INT NOT NULL,            
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    validated_by INT,                            -- admin qui valide (nullable jusqu’à validation)
    FOREIGN KEY (trained_category_id) REFERENCES player_categories(id),
    FOREIGN KEY (validated_by) REFERENCES users(id)
);
-- Création de la table des équipes sportives
CREATE TABLE sports_teams (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(100) NOT NULL,
    number_of_players INT
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
