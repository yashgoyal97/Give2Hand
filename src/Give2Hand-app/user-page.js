import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';



/**
* @customElement
* @polymer
*/
class UserPage extends PolymerElement {
    static get template() {
        return html`
<style>
    header {
        display: flex;
        flex-direction: row;
        justify-content:space-around;
    }
    form{
        display: flex;
        flex-direction: column;
    }
 
    main{
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
<div id="body">
<header>
    <div>
        <h2> Scheme Name:{{schemeData.schemeName}}</h2>
        <h2>Scheme Description:{{schemeData.schemeDescription}}</h2>
    </div>
    <div>
        <h2>Amount:{{schemeData.amount}}</h2>
        <h2>Tax Benefits:{{schemeData.taxBenefit}}</h2>
    </div>
</header>
<main>
<iron-form id="userForm">
<form>
    <paper-input label="Name" required id="userName"></paper-input>
    <paper-input type="email" required id="userEmail" label="Email Id" required></paper-input>
    <paper-input label="Phone Number" allowed-pattern=[0-9] required id="contactNumber" minlength=10 maxlength=10></paper-input>
    <paper-input label="PAN Number" required id="panCard" minlength=10 maxlength=10 ></paper-input>
    <paper-input label="Enter Card Details" id="cardNumber" allowed-pattern="[0-9]" minlength=16 maxlength=16></paper-input>
    
    <paper-input label="CVV" id="cvv" allowed-pattern="[0-9]" minlength=3 maxlength=3></paper-input>
    <paper-input label="Expiry Date" id="expiryDate" type=date ></paper-input>
    <paper-button on-click="_handleDonate" raised>Make Payment</paper-button>
</form>
</iron-form>
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
                value:
                    { 'schemeName': 'Food', 'schemeDescription': 'Food', 'amount': 20000, 'taxBenefit': 25 }
            }
        };
    }

    /**
    * Function to validate the entries added
    * object is posted only after all the validations are passed
    */
    _handleDonate() {
        if (this.$.userForm.validate()) {
            let userObj = { name: this.$.userName.value, email: this.$.userEmail.value, phoneNumber: parseInt(this.$.contactNumber.value), panNumber: this.$.panCard.value }
            console.log(userObj);
            this._makeAjax('http://10.117.189.106:9090/givetohand/donations','post',userObj);
        }
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