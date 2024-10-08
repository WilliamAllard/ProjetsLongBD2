/**
 * Javascript permet la vérification et la confirmation d'une commande de pizza
 * @author William Allard <william2006allard@gmail.com>
 * Note : Aide de ChatGPT donc Beaucoup de code vien de lui 
 */
// Variable Commande
let commandes = [];

// Variable Erreur
const errorElement = document.getElementsByClassName("error")[0];
let messageError = "";

/**
 * Permet de rafraichir les donnée du formulaire
 * @returns les information du client
 */
function getClientValues() {
    return {
        nomClient: document.getElementById('nomClient').value,
        cellClient: document.getElementById('cellClient').value,
        adresseClient: document.getElementById('adresseClient').value,
        villeClient: document.getElementById('villeClient').value,
        provinceClient: document.getElementById('provinceClient').value,
        paysClient: document.getElementById('paysClient').value,
        codePostalClient: document.getElementById('codePostalClient').value,
        taillePizza: document.getElementById('taillePizza').value,
        typeCroute: document.getElementById('typeCroute').value,
        choixSauce: document.getElementById('choixSauce').value,
        garnitures: Array.from(document.getElementById('garnitures').selectedOptions).map(option => option.text)
    };
}


/**
 * Permet l'affichage d'une Popus de Confirmation de Commandes
 */
function afficherPopup() {
    document.getElementById('popupOverlay').style.display = 'block';
    document.getElementById('resumeCommande').style.display = 'block';
}
/**
 * Permet la fermeture d'une Popus de Confirmation de Commandes
 */
function fermerPopup() {
    document.getElementById('popupOverlay').style.display = 'none';
    document.getElementById('resumeCommande').style.display = 'none';
}

// Vérification
/**
 * Permet de Vérifier le formulaire
 */
function verificationGlobal() {
    messageError = "";
    if (verifierValeurVide() && verifierTelephone() && verifierCodePostal() && minMaxGarniture()) {
        afficherResume();
    } else {
        errorElement.innerHTML = messageError;
    }
}

/**
 * Vérifie que aucune vauleur est vide
 * @returns si vide retourne un message, apparais le message et false au sinon true
 */
function verifierValeurVide(){
    const { nomClient, cellClient, adresseClient, villeClient, provinceClient, paysClient, codePostalClient } = getClientValues();

    if (nomClient == "" || cellClient == "" || adresseClient == "" || villeClient == "" || provinceClient == "" || paysClient == "" || codePostalClient == ""){
        messageError += "Le Formulaire est Incomplet ";
        errorElement.style.display = 'block';
        return false;
    }
    else{
        return true;
    }
}
/**
 * Vérifi que le numéro de téléphone est conforme 
 * @returns si vide retourne un message, apparais le message et false au sinon true
 */
function verifierTelephone() {
    const { cellClient } = getClientValues();
    const regex = /^(\(\+[0-9]{2}\)\s?)?([0-9]{3}[-\s]?)?([0-9]{3})[-\s]?([0-9]{4})(\/[0-9]{4})?$/;
    if (!regex.test(cellClient)) {
        messageError += "Le Numéro de Téléphone est invalide. ";
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}
/**
 * Vérifi que le code postal est conforme 
 * @returns si vide retourne un message, apparais le message et false au sinon true
 */
function verifierCodePostal() {
    const { codePostalClient } = getClientValues();
    const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    if (!regex.test(codePostalClient)) {
        messageError += "Le Code Postal est invalide. ";
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}
/**
 * Vérifie que bien au minimun 1 et maximum 4 garnitures on été selectionnée
 * @returns si vide retourne un message, apparais le message et false au sinon true
 */
function minMaxGarniture(){
    const { garnitures } = getClientValues();
    if (garnitures.length > 4) {
        messageError += "Vous ne pouvez sélectionner que 4 garnitures au maximum. ";
        errorElement.style.display = 'block';
        return false;
    } else if (garnitures.length == 0) {
        messageError += "Vous devez sélectionner au moins 1 garniture. ";
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}
/**
 * Affiche le résumer de la commande
 */
function afficherResume() {
    const {
        nomClient, cellClient, adresseClient, villeClient,
        provinceClient, paysClient, codePostalClient,
        taillePizza, typeCroute, choixSauce, garnitures
    } = getClientValues();

    const resume = `
        Client: ${nomClient}<br>
        Téléphone: ${cellClient}<br>
        Adresse: ${adresseClient}, ${villeClient}, ${provinceClient}, ${paysClient}<br>
        Code postal: ${codePostalClient}<br>
        Taille de pizza: ${taillePizza}<br>
        Croûte: ${typeCroute}<br>
        Sauce: ${choixSauce}<br>
        Garnitures: ${garnitures.length > 0 ? garnitures.join(', ') : 'Aucune'}
    `;

    document.getElementById('detailsCommande').innerHTML = resume;
    afficherPopup();
}
/**
 * Confirme la Commande
 */
function confirmerCommande() {
    const {
        nomClient, adresseClient, provinceClient, paysClient,
        codePostalClient, taillePizza, typeCroute, choixSauce, garnitures
    } = getClientValues();

    const commande = {
        nomClient,
        adresseClient,
        provinceClient,
        paysClient,
        codePostalClient,
        taillePizza,
        typeCroute,
        choixSauce,
        garnitures
    };
    commandes.push(commande);
    afficherListeLivraisons();
    resetForm();
    fermerPopup();
}
/**
 * Réinitialisation du formulaire
 */
function resetForm() {
    document.getElementById('formCommande').reset();
}

/**
 * compléter une livraison
 * @param {*} index est l'index de la commande
 */
function completerLivraison(index) {
    commandes.splice(index, 1);
    afficherListeLivraisons();
}
/**
 * Affiche les commandes en cours de livraison
 */
function afficherListeLivraisons() {
    const listeLivraisons = document.getElementById('listeLivraisons');
    listeLivraisons.innerHTML = ''; // Réinitialiser la liste

    commandes.forEach((commande, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${commande.nomClient}</strong> - ${commande.taillePizza} pizza (${commande.typeCroute}, ${commande.choixSauce}) avec ${commande.garnitures.join(', ')}
            <button onclick="completerLivraison(${index})">Compléter la livraison</button>
        `;
        listeLivraisons.appendChild(li);
    });
}

/**
 * DropDown Without CTLR
 * @author GMK Hussain <https://codepen.io/gmkhussain>
 * @link : https://codepen.io/gmkhussain/pen/ozwwPw
 * @param {*} elemSelector 
 */
const multiSelectWithoutCtrl = ( elemSelector ) => {
    let options = [].slice.call(document.querySelectorAll(`${elemSelector} option`));
    options.forEach(function (element) {
        element.addEventListener("mousedown", 
            function (e) {
                e.preventDefault();
                element.parentElement.focus();
                this.selected = !this.selected;
                return false;
            }, false );
    });
}
  
multiSelectWithoutCtrl('#garnitures');