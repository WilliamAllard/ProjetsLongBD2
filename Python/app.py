from flask import Flask, render_template
import os
from dotenv import load_dotenv
import mysql.connector

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

@app.route('/commandes')
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
    return render_template('commandes.html', croutes=croutes, sauces=sauces, garnitures=garnitures)

if __name__ == '__main__':
    app.run(debug=True)