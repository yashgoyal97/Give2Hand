import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-input/paper-input.js';


/**
 * @customElement
 * @polymer
 */
class HomePage extends PolymerElement {
    static get template() {
        return html`
        <style>
        .container{
            display:grid;
            grid-template-rows:1fr 9fr 1fr;
            grid-template-columns:1fr;
            grid-template-areas:"header" "main" "footer";
            grid-gap:2px;
        }
        header{
            grid-area:header;
            border:2px solid;
            display:grid;
            grid-template-rows:1fr;
            grid-template-columns:1fr 1fr 1fr
            grid-template-areas:"empty logo empty";
        }
        #logo{
            grid-area: logo;
        }
        main{
            grid-area:main;
            border:2px solid;
            display:flex;
            flex-direction:column;
        }
        #schemeDetails{
            // display:none;
            padding:20px;
        }
        footer{
            grid-area:footer;
            border:2px solid;
        }
        </style>
        <div class="container">
            <header>
                <div id="logo"><h2>Give2Hand<iron-icon icon="all-out"></iron-icon></h2></div>
            </header>
            <main>
                <div id='schemeDetails'>
                    <paper-input name='schemeName' id='schemeName' label="Scheme Name" readonly></paper-input>
                    <paper-input name='schemeDescription' id='schemeDescription' label="Scheme Description" readonly></paper-input>
                    <paper-input name='schemeAmount' id='schemeAmount' label="Amount" readonly></paper-input>
                    <paper-input name='taxBenefit' id='taxBenefit' label="Tax Benefit" readonly></paper-input>
                    <paper-button id="selectSchemeBtn" on-click="_handleContinue" raised>Continue</paper-button>
                </div>
            </main>
            <footer>Footer</footer>
        </div>
        <iron-ajax id="ajax" handle-as="json" content-type="application/json" on-response="_handleresponse" on-error="_handleError"></iron-ajax>
    `;
    }

    static get properties() {
        return {
            schemes:{
                type:Array,
                value:[]
            }
        };
    }

    connectedCallback(){
        super.connectedCallback();
        this.action='schemes'
        this._makeAjaxCall(`${baseUrl}/givetwohand/schemes`,'get',null);
    }

    _handleContinue(){

    }

    /**
     * 
     * @param {*} event 
     */
    _handleViewSchemeDetails(event){
        this.selectedScheme=event.model.item;
    }
}

window.customElements.define('home-page', HomePage);
