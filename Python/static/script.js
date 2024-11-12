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
  
multiSelectWithoutCtrl('#typeGarnitures');


function afficherResumerCommande(){
  let nomClient = document.getElementById("nomClient").value;
  let cellClient = document.getElementById("cellClient").value;
  let adresseClient = document.getElementById("adresseClient").value;
  let villeClient = document.getElementById("villeClient").value;
  let provinceClient = document.getElementById("provinceClient").value;
  let codePostalClient = document.getElementById("codePostalClient").value
  let selectCroute = document.getElementById("typeCroute");
  let selectSauce = document.getElementById("typeSauce");
  let selectGarnitures = document.getElementById("typeGarnitures");
  let buttonConfimer = document.getElementById("buttonConfirmer");
  
  let selectedCroute = selectCroute.options[selectCroute.selectedIndex].text;
  let selectedSauce = selectSauce.options[selectSauce.selectedIndex].text;

  let selectedGarnitures = [];
  for (let i = 0; i < selectGarnitures.options.length; i++) {
    if (selectGarnitures.options[i].selected) {
      selectedGarnitures.push(selectGarnitures.options[i].text);
    }
  }

  let resumeText = `Client: ${nomClient}, Téléphone: ${cellClient}, Adresse: ${adresseClient}, Ville: ${villeClient}, Province: ${provinceClient}, Code Postal: ${codePostalClient}.
  <br>Commande: Croûte ${selectedCroute}, Sauce ${selectedSauce}, Garnitures: ${selectedGarnitures.length > 0 ? selectedGarnitures.join(', ') : 'Aucune garniture sélectionnée'}`;

  document.getElementById("resumer").innerHTML = resumeText;
  buttonConfimer.className = "buttonConfirmerPresent";
}