from flask import Flask, render_template, request, redirect, url_for
import os
from dotenv import load_dotenv
import mysql.connector
from datetime import datetime

app = Flask(__name__)

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
    cursor = connexion.cursor()
    cursor.execute("SELECT count(id) FROM Commandes_Attentes;")
    data = cursor.fetchone()
    cursor.close()
    return render_template('index.html', data=data)

@app.route('/commandes', methods=['GET', 'POST'])
def commandes():
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
        
        
    # Formulaire de commande
    
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
        
        if error != "":
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
                idCommandeInsert = cursor.lastrowid
                cursor.close()
                return redirect('/confirmation')
            except mysql.connector.Error as erreur:
                print(erreur)
        else:
            print(error)        
                
    return render_template('commandes.html', croutes=croutes, sauces=sauces, garnitures=garnitures)


@app.route('/confirmation')
def confirmation():
    return "Commande confirmée !"

if __name__ == '__main__':
    app.run(debug=True)