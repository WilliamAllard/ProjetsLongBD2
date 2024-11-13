"""
Fichier Principal pour gérer les commandes, affichage des commande en Attente et la Completion des Commandes

Le fichier s'occupe de la connection avec la Base de Donnée et l'interface web avec Flask

Dépendances:
    - Flask
    - mysql-connector-python
    - dotenv
    
Auteur: William Allard
Date: Novembre 2024
"""
from flask import Flask, render_template, request, redirect, url_for
import os
from dotenv import load_dotenv
import mysql.connector
from datetime import datetime

app = Flask(__name__)

erreurForm = ""

# Charge les variables d'environnement à partir du fichier .env
load_dotenv()

# Récupère les variables d'environnement
db_host = os.getenv('DB_HOST')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_name = os.getenv('DB_NAME')
db_port = os.getenv('DB_PORT')


# Établir la connexion à la base de données
connexion = mysql.connector.connect(
    host=db_host,
    user=db_user,
    password=db_password,
    database=db_name,
    port=db_port
)

# Vérifier si la connexion est établie
if connexion.is_connected():
    print("Connexion réussie à la base de données")
else:
    print("Échec de la connexion à la base de données")
    
@app.route('/')
def index():
    """
    Fonction Principal qui affiche le menu pour commander et Afficher le detail des commande
    """
    try:
        cursor = connexion.cursor()
        cursor.execute("SELECT count(id) FROM Commandes_Attentes;")
        data = cursor.fetchone()
        cursor.close()
    except mysql.connector.Error as erreur:
        print(erreur)
    return render_template('index.html', data=data)

@app.route('/commandes', methods=['GET', 'POST'])
def commandes():
    """
    Fonction pour affiche les Croutes, les Sauces et les Garnitures dans le templates pour la commandes
    """
    # Croute 
    try: 
        cursor = connexion.cursor()
        cursor.execute("SELECT id, type_croute FROM Croutes;")
        croutes = cursor.fetchall()
        cursor.close()
    except mysql.connector.Error as erreur:
        print(erreur)
        
    # Sauces
    try: 
        cursor = connexion.cursor()
        cursor.execute("SELECT id, type_sauce FROM Sauces;")
        sauces = cursor.fetchall()
        cursor.close()
    except mysql.connector.Error as erreur:
        print(erreur)
        
    # Garnitures
    try: 
        cursor = connexion.cursor()
        cursor.execute("SELECT id, type_garniture FROM Garnitures;")
        garnitures = cursor.fetchall()
        cursor.close()
    except mysql.connector.Error as erreur:
        print(erreur)      
                
    return render_template('commandes.html', croutes=croutes, sauces=sauces, garnitures=garnitures)

@app.route('/insertCommandes', methods=['POST', 'GET'])
def insertCommandes():
    """
    Fonction qui s'occupe de la vérification et l'insertion des commandes dans la base de donner 
    (L'insertion des commandes en Attente se fait via un Déclancheur)
    """
    
    # Erreur
    error = ""

        
    if request.method == 'POST':
        nomClient = request.form['nomClient']
        cellClient = request.form['cellClient']
        adresseClient = request.form['adresseClient']
        villeClient = request.form['villeClient']
        provinceClient = request.form['provinceClient']
        codePostalClient = request.form['codePostalClient']
        typeCroute = int(request.form['typeCroute'])
        typeSauce = int(request.form['typeSauce'])
        SelectGarnitures = request.form.getlist('typeGarnitures')  # Liste d'IDs de garnitures
        
        
        # Vérifier si les champs sont vides
        
        if nomClient == "" or cellClient == "" or adresseClient == "" or villeClient == "" or provinceClient == "" or codePostalClient == "":
            error += "Veuillez remplir tous les champs"
        
        # Vérifier Type Garniture Max 4
        
        if len(SelectGarnitures) > 4:
            error += "Veuillez sélectionner un maximum de 4 garnitures"
        
        if error == "":
            # Insert Client
            
            clientInformation = (nomClient, cellClient, adresseClient, villeClient, provinceClient, codePostalClient)
            
            try: 
                cursor = connexion.cursor()
                cursor.execute("""
                    INSERT INTO Clients (nom, telephone, adresse, ville, province, code_postal)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, clientInformation)
                connexion.commit()
                idClientInsert = cursor.lastrowid
                cursor.close()
            except mysql.connector.Error as erreur:
                print(erreur)
                
            # Insert Commande
            
            commandeInformation = (typeCroute, typeSauce, idClientInsert, datetime.now())
            
            try:
                cursor = connexion.cursor()
                cursor.execute("""
                    INSERT INTO Commandes (id_croute, id_sauce, id_client, date)
                    VALUES (%s, %s, %s, %s)
                """, commandeInformation)
                connexion.commit()
                idCommandeInsert = cursor.lastrowid
                cursor.close()
            except mysql.connector.Error as erreur:
                print(erreur)
                
            # Insert Garniture Commande
            
            garnituresInformation = [(idCommandeInsert, int(garniture_id)) for garniture_id in SelectGarnitures]
            
            try:
                cursor = connexion.cursor()
                cursor.executemany("""
                    INSERT INTO Garnitures_Commandes (id_commande, id_garniture)
                    VALUES (%s, %s)
                """, garnituresInformation)
                connexion.commit()
                cursor.close()
            except mysql.connector.Error as erreur:
                print(erreur)
        else:
            print(error)
    error = erreurForm
    
    return redirect(url_for('confirmation', idCommandeInsert=idCommandeInsert))
    

@app.route('/confirmation')
def confirmation():
    """
    Affiche les details de la commandes passée
    """
    idCommande = request.args.get('idCommandeInsert')
    confirmer = "Commande confirmée !"
    
    try:
        cursor = connexion.cursor()
        query = """ 
            SELECT 
                Clients.nom AS nom_client,
                CONCAT(Clients.adresse,', ',Clients.ville,', ',Clients.province,', ',Clients.code_postal) AS adresse_client,
                Commandes.date AS date_commande,
                Croutes.type_croute AS croute,
                Sauces.type_sauce AS sauce,
                GROUP_CONCAT(Garnitures.type_garniture ORDER BY Garnitures.type_garniture SEPARATOR ', ') AS garnitures
            FROM
                Commandes_Attentes
                    INNER JOIN Commandes ON Commandes_Attentes.id_commande = Commandes.id
                    INNER JOIN Clients ON Commandes.id_client = Clients.id
                    INNER JOIN Croutes ON Commandes.id_croute = Croutes.id
                    INNER JOIN Sauces ON Commandes.id_sauce = Sauces.id
                    INNER JOIN Garnitures_Commandes ON Commandes.id = Garnitures_Commandes.id_commande
                    INNER JOIN Garnitures ON Garnitures_Commandes.id_garniture = Garnitures.id
			WHERE Commandes.id = %s
            GROUP BY Commandes_Attentes.id , Commandes.id , Clients.nom , adresse_client , Commandes.date , Croutes.type_croute , Sauces.type_sauce
            ORDER BY Commandes_Attentes.date;
        """
        cursor.execute(query,(idCommande,))
        data = cursor.fetchall()
        cursor.close
    except mysql.connector.Error as erreur:
        print(erreur)
    
    return render_template('confirmation.html', confirmer = confirmer, idCommande=idCommande, data=data)

@app.route('/attente')
def detail():
    """
    Voici les commandes en attente 
    """
    
    try:
        cursor = connexion.cursor()
        cursor.execute(""" 
            SELECT 
                Commandes.id as id_commande,
                Clients.nom AS nom_client,
                CONCAT(Clients.adresse,', ',Clients.ville,', ',Clients.province,', ',Clients.code_postal) AS adresse_client,
                Commandes.date AS date_commande,
                Croutes.type_croute AS croute,
                Sauces.type_sauce AS sauce,
                GROUP_CONCAT(Garnitures.type_garniture ORDER BY Garnitures.type_garniture SEPARATOR ', ') AS garnitures
            FROM
                Commandes_Attentes
                    INNER JOIN Commandes ON Commandes_Attentes.id_commande = Commandes.id
                    INNER JOIN Clients ON Commandes.id_client = Clients.id
                    INNER JOIN Croutes ON Commandes.id_croute = Croutes.id
                    INNER JOIN Sauces ON Commandes.id_sauce = Sauces.id
                    INNER JOIN Garnitures_Commandes ON Commandes.id = Garnitures_Commandes.id_commande
                    INNER JOIN Garnitures ON Garnitures_Commandes.id_garniture = Garnitures.id
            GROUP BY Commandes_Attentes.id , Commandes.id , Clients.nom , adresse_client , Commandes.date , Croutes.type_croute , Sauces.type_sauce
            ORDER BY Commandes_Attentes.date;
        """)
        data = cursor.fetchall()
        cursor.close
    except mysql.connector.Error as erreur:
        print(erreur)
        data = []
    
    is_empty = len(data) == 0
    return render_template('attente.html', data = data, is_empty=is_empty)


@app.route('/supprimer_commande', methods=['POST'])
def supprimer_commande():
    """
    Permet de Supprimer les commandes en Attente
    """
    id_commande = request.form.get('id_commande')
    
    try:
        cursor = connexion.cursor()
        cursor.execute("DELETE FROM Commandes_Attentes WHERE id_commande = %s", (id_commande,))
        cursor.execute("DELETE FROM Commandes WHERE id = %s", (id_commande,))
        connexion.commit()
        cursor.close()

        return redirect(url_for('detail')) 
    except mysql.connector.Error as erreur:
        print(erreur)
        return redirect(url_for('detail'))

if __name__ == '__main__':
    app.run(debug=True)