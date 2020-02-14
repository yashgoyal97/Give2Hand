import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-toast/paper-toast.js';


/**
 * @customElement
 * @polymer
 */
class SchemePage extends PolymerElement {
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
        #schemeDetails{
            padding:20px;
            display:grid;
            grid-template-rows:1fr;
            grid-template-columns:3fr 7fr;
            grid-template-areas:"image data";
            grid-gap:5px;
        }
        #image{
            grid-area:image;
        }
        img{
            height:300px;
            width:300px;
        }
        #schemeData{
            grid-area:data;
            padding:20px;
            background-color:rgba(0,0,0,0.1);
            border-radius:5px;
        }
        #goToHomeBtn{
            grid-area:homepage;
        }
        #selectSchemeBtn{
            background-color:rgba(0,50,255,0.6);
            color:white;
            width:400px;
        }
        </style>
        <div class="container">
            <header>
                <div id="logo"><h2>Give2Hand<iron-icon icon="all-out"></iron-icon></h2></div>
                <paper-button id="goToHomeBtn" on-click="_handleBack">HOMEPAGE<iron-icon icon='home'></iron-icon></paper-button>
            </header>
            <main>
                <div id='schemeDetails'>
                    <div id="image">
                    <img src="{{imageUrl}}">
                    </div>
                    <div id="schemeData">
                        <h4>Scheme: {{schemeObj.schemeName}}</h4>
                        <h4>Description: {{schemeObj.description}}</h4>
                        <iron-form id='amountForm'>
                            <form>
                                <paper-input name='schemeAmount' id='schemeAmount' label="Amount" type="number" on-input='_handleAmountChange'></paper-input>
                                <paper-input name='taxBenefit' id='taxBenefit' label="Tax Benefit" disabled></paper-input>
                                <paper-button id="selectSchemeBtn" on-click="_handleContinue" raised>Donate</paper-button>
                            </form>
                        </iron-form>
                    </div>
                </div>
            </main>
        </div>
        <iron-ajax id="ajax" handle-as="json" content-type="application/json" on-response="_handleresponse" on-error="_handleError"></iron-ajax>
    `;
    }

    static get properties() {
        return {
            schemes: {
                type: Array,
                value: []
            },
            selectedScheme: {
                type: Object,
                value: this.selectedScheme,
                observer: "_selectedSchemeChanged"
            },
            imageUrl: {
                type: String,
                value: ""
            },
            schemeObj: {
                type: Object,
                value: {}
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
    }

    _handleAmountChange() {
        this.$.taxBenefit.value = 0.05 * this.$.schemeAmount.value;
    }

    _selectedSchemeChanged(newVal) {
        this.schemeObj = newVal;
        this.$.schemeAmount.value = newVal.amount;
        this.$.taxBenefit.value = newVal.taxBenefit;
        this.imageUrl = newVal.imageUrl;
    }

    _handleBack() {
        window.history.pushState({}, null, '#/home');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

    _handleContinue() {
        let schemeData = { schemeName: this.$.schemeName.value, schemeDescription: this.$.schemeDescription.value, amount: parseInt(this.$.schemeAmount.value), taxBenefit: parseInt(this.$.taxBenefit.value) };
        this.dispatchEvent(new CustomEvent('send-scheme', { detail: { item: schemeData }, bubbles: true, composed: true }));
    }

    _handleViewSchemeDetails(event) {
        this.selectedScheme = event.model.item;
    }
}

window.customElements.define('scheme-page', SchemePage);
