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
            grid-template-rows:80px auto;
            grid-template-columns:1fr;
            grid-template-areas:"header" "main";
            grid-gap:2px;
           
        }
        header{
            grid-area:header;
            display:grid;
            grid-template-rows:1fr;
            grid-template-columns:1fr 1fr 1fr
            grid-template-areas:"empty logo empty";
            background-color:rgba(0,50,255,0.6);
            color:white;
        }
        #logo{
            grid-area: logo;
        }
        main{
            grid-area:main;
            display:flex;
            flex-direction:column;
        }
        #schemes{
            display:flex;
            flex-direction:row;
            flex-wrap:wrap;
            margin:20px 60px 20px 60px;
        }
        paper-card{
            height:290px;
            width:350px;
            border-radius:2px;
            margin:20px;
            padding:10px;
            --paper-card-header-image:{
                height:220px;
                width:320px;
                }
            }
        }
        </style>
        <div class="container">
            <header>
                <div id="logo"><h2>Give2Hand<iron-icon icon="all-out"></iron-icon></h2></div>
            </header>
            <main>
                <div id='schemes'>
                    <template is="dom-repeat" items="{{schemes}}">
                        <paper-card  on-click="_handleViewSchemeDetails" image="{{item.imageUrl}}">
                            <h3>{{item.schemeName}}</h3>
                        </paper-card>
                    </template>
                </div>
            </main>
        </div>
        <iron-ajax id="ajax" handle-as="json" content-type="application/json" on-response="_handleResponse" on-error="_handleError"></iron-ajax>
    `;
    }

    static get properties() {
        return {
            schemes:{
                type:Array,
                value:[]
            },
            imageUrl:{
                type:String,
                value:""
            }
        };
    }

    connectedCallback(){
        super.connectedCallback();
        this._makeAjaxCall(`${baseUrl}/givetohand/schemes`,'get',null);
    }

    _handleResponse(event){
        this.schemes=event.detail.response;
    }

    /**
     * 
     * @param {*} event 
     */
    _handleViewSchemeDetails(event){
        this.selectedScheme=event.model.item;
        this.dispatchEvent(new CustomEvent('display-scheme',{detail:{item:this.selectedScheme},bubbles:true,composed:true}));
        window.history.pushState({}, null, '#/scheme');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

    /**
     * reusable function to make ajax calls
     * @param {String} url 
     * @param {String} method 
     * @param {Object} postObj 
     */
    _makeAjaxCall(url, method, postObj) {
        let ajax = this.$.ajax;
        ajax.url=url;
        ajax.method=method;
        ajax.body=postObj?JSON.stringify(postObj):undefined;
        ajax.generateRequest();
    }


}

window.customElements.define('home-page', HomePage);
