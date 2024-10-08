let commandes = [];

function afficherResume() {
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

    // Validation pour maximum 4 garnitures
    if (garnitures.length > 4) {
        alert('Vous pouvez sélectionner un maximum de 4 garnitures.');
        return;
    }

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
    document.getElementById('resumeCommande').style.display = 'block';
}

function confirmerCommande() {
    const nomClient = document.getElementById('nomClient').value;
    const adresseClient = document.getElementById('adresseClient').value;
    const provinceClient = document.getElementById('provinceClient').value;
    const paysClient = document.getElementById('paysClient').value;
    const codePostalClient = document.getElementById('codePostalClient').value;
    const taillePizza = document.getElementById('taillePizza').value;
    const typeCroute = document.getElementById('typeCroute').value;
    const choixSauce = document.getElementById('choixSauce').value;
    const garnitures = Array.from(document.querySelectorAll('input[name="garniture"]:checked')).map(checkbox => checkbox.parentElement.textContent.trim());

    // Validation pour maximum 4 garnitures
    if (garnitures.length > 4) {
        alert('Vous pouvez sélectionner un maximum de 4 garnitures.');
        return;
    }

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
    alert("Commande confirmée!");
}

// Afficher la liste des commandes en attente de livraison
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

// Compléter une livraison et retirer la commande de la liste
function completerLivraison(index) {
    commandes.splice(index, 1); // Retirer la commande de la liste
    afficherListeLivraisons(); // Mettre à jour la liste des livraisons
}

// Réinitialiser le formulaire de commande
function resetForm() {
    document.getElementById('formCommande').reset();
    document.getElementById('resumeCommande').style.display = 'none';
}
