DROP DATABASE IF EXISTS pizzeria;
CREATE DATABASE pizzeria;

USE pizzeria;

CREATE TABLE IF NOT EXISTS Croutes (
id INT AUTO_INCREMENT PRIMARY KEY,
type_croute VARCHAR(255) NOT NULL
);

INSERT INTO Croutes (type_croute) VALUES ('Classique'), ('Mince'), ('Épaisse');

CREATE TABLE IF NOT EXISTS Sauces (
id INT AUTO_INCREMENT PRIMARY KEY,
type_sauce VARCHAR(255) NOT NULL
);

INSERT INTO Sauces (type_sauce) VALUES ('Tomate'), ('Spaghetti'), ('Alfredo');

CREATE TABLE IF NOT EXISTS Garnitures (
id INT AUTO_INCREMENT PRIMARY KEY,
type_garniture VARCHAR(255) NOT NULL
);

INSERT INTO Garnitures (type_garniture) VALUES 
('Pepperoni'), ('Champignons'), ('Oignons'), 
('Poivrons'), ('Olives'), ('Anchois'), 
('Bacon'), ('Poulet'), ('Maïs'), 
('Fromage'), ('Piments forts');

CREATE TABLE IF NOT EXISTS Clients (
id INT AUTO_INCREMENT PRIMARY KEY,
nom VARCHAR(255) NOT NULL,
telephone VARCHAR(50) NOT NULL,
adresse VARCHAR(255) NOT NULL,
ville VARCHAR(50) NOT NULL,
province VARCHAR(50) NOT NULL,
code_postal VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Commandes (
id INT AUTO_INCREMENT PRIMARY KEY,
id_croute INT NOT NULL,
id_sauce INT NOT NULL,
id_client INT NOT NULL,
date DATETIME NOT NULL,
FOREIGN KEY (id_croute) REFERENCES Croutes(id),
FOREIGN KEY (id_sauce) REFERENCES Sauces(id),
FOREIGN KEY (id_client) REFERENCES Clients(id)
ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Garnitures_Commandes (
id INT AUTO_INCREMENT PRIMARY KEY,
id_commande INT NOT NULL,
id_garniture INT NOT NULL, 
FOREIGN KEY (id_commande) REFERENCES Commandes(id),
FOREIGN KEY (id_garniture) REFERENCES Garnitures(id)
ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Commandes_Attentes (
id INT AUTO_INCREMENT PRIMARY KEY,
id_commande INT NOT NULL,
date DATETIME NOT NULL,
FOREIGN KEY (id_commande) REFERENCES Commandes(id)
ON DELETE CASCADE
);

DROP TRIGGER IF EXISTS commandes_attentes_apres_insertion;

DELIMITER $$

CREATE TRIGGER commandes_attentes_apres_insertion
    AFTER INSERT 
    ON Commandes FOR EACH ROW
    BEGIN
        INSERT INTO Commandes_Attentes (id_commande, date) VALUES (NEW.id, NOW());
    END $$

DELIMITER ;
