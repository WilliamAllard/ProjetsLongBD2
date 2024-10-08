// Variable Commande
let commandes = [];

// Variable Erreur
const errorElement = document.getElementsByClassName("error")[0];
let messageError = "";

// Variable Client
const nomClient = document.getElementById('nomClient').value;
const cellClient = document.getElementById('cellClient').value;
const adresseClient = document.getElementById('adresseClient').value;
const villeClient = document.getElementById('villeClient').value;
const provinceClient = document.getElementById('provinceClient').value;
const paysClient = document.getElementById('paysClient').value;
const codePostalClient = document.getElementById('codePostalClient').value;
const taillePizza = document.getElementById('taillePizza').value;
const typeCroute = document.getElementById('typeCroute').value;
const choixSauce = document.getElementById('choixSauce').value;
const garnituresOptions = document.getElementById('garnitures');
const garnitures = Array.from(garnituresOptions.selectedOptions).map(option => option.text);

function afficherPopup() {
    document.getElementById('popupOverlay').style.display = 'block';
    document.getElementById('resumeCommande').style.display = 'block';
}

function fermerPopup() {
    document.getElementById('popupOverlay').style.display = 'none';
    document.getElementById('resumeCommande').style.display = 'none';
}

function consoleTest(){
    console.log(verifierTelephone());
    console.log(verifierCodePostal());
    console.log(verifierGarnitures());
}

// Vérification globale
function verificationGlobal() {
    messageError = "";

    if (verifierTelephone() && verifierCodePostal() && verifierGarnitures() ) {
        afficherResume();
        return true;
    } else {
        errorElement.innerHTML = messageError;
        errorElement.style.display = 'block';
        return false;
    }
}

function verifierTelephone() {
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

function verifierCodePostal() {
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

function verifierGarnitures() {
    if (garnitures.length === 0) {
        messageError += "Veuillez sélectionner au moins une garniture. ";
        return false;
    }
    if (garnitures.length > 4) {
        messageError += "Vous pouvez sélectionner un maximum de 4 garnitures. ";
        return false;
    }
    return true;
}

function afficherResume() {

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

function confirmerCommande() {

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
    alert("Commande confirmée!");
}

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
