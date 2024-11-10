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