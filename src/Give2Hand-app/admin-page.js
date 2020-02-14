import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/gold-cc-input/gold-cc-input.js';
import '@polymer/iron-icons/iron-icons.js';



/**
* @customElement
* @polymer
*/
class UserPage extends PolymerElement {
    static get template() {
        return html`
<style>
    .container{
        display:grid;
        grid-template-rows:80px auto;
        grid-template-columns:1fr;
        grid-template-areas:"header" "main" "footer";
        grid-gap:2px;
    }
    header{
        grid-area:header;
        background-color:rgba(0,50,255,0.6);
        color:white;
        display:grid;
        grid-template-rows:1fr;
        grid-template-columns:1fr 1fr 1fr;
        grid-template-areas:"empty logo homepage";
        padding:5px;
    }
    #logo{
        grid-area: logo;
    }
    main{
        grid-area:main;
        display:flex;
        flex-direction:column;
    }
    #goToHomeBtn{
        grid-area:homepage;
    }
    #header {
        display: flex;
        flex-direction: row;
        justify-content:space-around;
    }
    form{
        display: flex;
        flex-direction: column;
    }
 
    #main{
        margin:10px auto;
        border:2px solid black;
        border-radius:10px;
        padding:10px;
        width:50%;
    }
    paper-button{
        margin:10px;
    }
</style>
<div class="container">
    <header>
        <div id="logo"><h2>Give2Hand<iron-icon icon="all-out"></iron-icon></h2></div>
        <paper-button id="goToHomeBtn" on-click="_handleLogout">LOGOUT<iron-icon icon='settings-power'></iron-icon></paper-button>
    </header>
    <main>
        
    </main>
</div>
<iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>
`;
    }
    /**
     * Properties used are defined here with their respective default values.
     */

    static get properties() {
        return {
            schemeData: {
                type: Object,
                value: this.schemeData,
                observer: "_schemeDataChanged"
            }
        };
    }

    // _handleLogout(){

    // }

    /**
    * Function to validate the entries added
    * object is posted only after all the validations are passed
    */
    _handleDonate() {
        if (this.$.userForm.validate()) {
            let userObj = { name: this.$.userName.value, email: this.$.userEmail.value, phoneNumber: parseInt(this.$.contactNumber.value), panNumber: this.$.panCard.value }
            console.log(userObj);
            this._makeAjax('http://10.117.189.106:9090/givetohand/donations', 'post', userObj);
        }
    }

    _handleBack() {
        window.history.pushState({}, null, '#/home');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }


    _schemeDataChanged(newVal) {
        this.schemeObj = newVal;
    }


    /**
    * @param {String} url 
    * @param {String} method 
    * @param {Object} postObj 
    */
    _makeAjax(url, method, postObj) {
        let ajax = this.$.ajax;
        ajax.url = url;
        ajax.method = method;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }
}

window.customElements.define('user-page', UserPage);