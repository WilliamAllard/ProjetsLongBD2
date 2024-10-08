// Variable Commande
let commandes = [];

// Variable Erreur
const errorElement = document.getElementsByClassName("error")[0];
let messageError = "";

// Variable Client
const nomClient = document.getElementById('nomClient').value;
let cellClient = document.getElementById('cellClient');
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
    console.log(minMaxGarniture());

    const regex = /^(\(\+[0-9]{2}\)\s?)?([0-9]{3}[-\s]?)?([0-9]{3})[-\s]?([0-9]{4})(\/[0-9]{4})?$/;
    console.log(regex.test(cellClient))
    console.log(cellClient)
}


// Vérification globale
function verificationGlobal() {
    messageError = "";

    
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

function minMaxGarniture(){
    if (garnitures.length > 4) {
        messageError += "Vous ne pouvez sélectionner que 4 garnitures au maximum. ";
        errorElement.style.display = 'block';
        return false;
    } else if (garnitures.length < 0) {
        messageError += "Vous devez sélectionner au moins 0 garniture. ";
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
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

// DropDown Withoud Control Source : https://codepen.io/gmkhussain/pen/ozwwPw

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
  
multiSelectWithoutCtrl('#garnitures')