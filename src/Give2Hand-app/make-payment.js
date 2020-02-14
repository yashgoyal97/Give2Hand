import { html , PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';


class MakePayment extends PolymerElement{
    static get template(){
        return html`
        <paper-input label="some"></paper-input>
        `;
    }
        static get properties(){
            return {};
        }
    }
window.customElements.define('make-payment',MakePayment);