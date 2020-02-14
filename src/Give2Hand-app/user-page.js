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
    #body{
        background-color:rgba(255,255,255,0.9)
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
        background-color:rgba(0,50,255,0.6);
        color:white;
        margin:10px;
    }
</style>
<div class="container">
    <header>
        <div id="logo"><h2>Give2Hand<iron-icon icon="all-out"></iron-icon></h2></div>
        <paper-button id="goToHomeBtn" on-click="_handleBack">HOMEPAGE<iron-icon icon='home'></iron-icon></paper-button>
    </header>
    <main>
        <div id="body">
            <div id="header">
                <div>
                    <h3> Scheme Name:{{schemeObj.schemeName}}</h3>
                    <h3>Scheme Description:{{schemeObj.description}}</h3>
                </div>
                <div>
                    <h3>Amount:{{schemeObj.amount}}</h3>
                    <h3>Tax Benefits:{{schemeObj.taxBenefit}}</h3>
                </div>
            </div>
            <div id="main">
                <iron-form id="userForm">
                    <form>
                        <paper-input label="Name" required id="userName"></paper-input>
                        <paper-input type="email" required id="userEmail" label="Email Id" required></paper-input>
                        <paper-input label="Phone Number" allowed-pattern=[0-9] required id="contactNumber" minlength=10 maxlength=10></paper-input>
                        <paper-input label="PAN Number" required id="panCard" minlength=10 maxlength=10 ></paper-input>
                        <gold-cc-input label="Enter Card Details" name="cardNumber" id="cardNumber"  auto-validate error-message="Enter valid visa or mastercard!" card-types='["visa", "mastercard"]' required></gold-cc-input>
                        <paper-input label="CVV" id="cvv" allowed-pattern="[0-9]" minlength=3 maxlength=3></paper-input>
                        <paper-input label="Expiry Date" id="expiryDate" type=date ></paper-input>
                        <paper-button on-click="_handleDonate" raised>Make Payment</paper-button>
                    </form>
                </iron-form>
            </div>
        </div>
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
            },
            schemeObj: {
                type: Object,
                value: {}
            }
        };
    }

    /**
    * Function to validate the entries added
    * object is posted only after all the validations are passed
    */
    _handleDonate() {
        if (this.$.userForm.validate()) {
            let userObj = { name: this.$.userName.value, email: this.$.userEmail.value, phoneNumber: parseInt(this.$.contactNumber.value), panNumber: this.$.panCard.value, schemeId: this.schemeObj.schemeId,paymentType:"CREDIT" };
            console.log(userObj);
            this._makeAjax('http://10.117.189.181:9090/givetohand/donations', 'post', userObj);
        }
    }

    _handleResponse(event) {
        if (event.detail.response.statusCode === 200) {
            window.history.pushState({}, null, '#/home');
            window.dispatchEvent(new CustomEvent('location-changed'));
        }
    }

    _handleBack() {
        window.history.pushState({}, null, '#/home');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }


    _schemeDataChanged(newVal) {
        console.log(newVal,"yashgoyal")
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