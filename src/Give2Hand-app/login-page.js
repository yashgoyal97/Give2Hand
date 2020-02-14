import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-toast/paper-toast.js';



class LoginPage extends PolymerElement {
    static get template() {
        return html`

            <style>
            :host{
                 background-color:whitesmoke; 
                display:block;
                overflow-y:hidden;
            }
            #toast0{
                background-color:rgba(255,0,0,0.5);
            }

            #loginForm{
                margin: 100px auto;
                width:40%;
                background-color: white;
                border: 2px ;
                border-radius:15px;
                padding: 20px;
            }
            h1{
                text-align: center;
            }
            #loginButton{
                background-color: rgba(0,50,255,0.6);
                color: white;
                margin-top: 10px;

            }
            #loginFields{
                display: flex;
                flex-direction: column;
            }
            header{
                margin: 0;
                color:white;
                width: 100%;
                background-color: rgba(0,50,255,0.6);
            }
           
            </style>
            <app-location route="{{route}}"></app-location>
            <div id="body">
           <header>
               <h1>Give2Hand</h1>
           </header>
                
                <main>
                    <iron-form id='loginForm'>
                        <form>
                            <div id='loginFields'>
                                <h1>Login</h1>
                                <paper-input id='username' name='username' label='Enter Phone No' allowed-pattern="[0-9]" maxlength="10" minlength="10" required ><iron-icon icon='perm-identity' slot='suffix'></iron-icon></paper-input>
                                <paper-input id='password' name='password' label='Enter Password' type='password' required ><iron-icon icon='lock' slot='suffix'></iron-icon></paper-input>
                                <paper-button name='loginButton' id='loginButton' on-click='_handleLogin' raised>Login</paper-button>                
                        </div>
                            </form>
                    </iron-form>
                </main>
            </div>
            <paper-toast id='toast0' text='Invalid Credentials'></paper-toast>
            <paper-toast id='toast1' text='Connection Error'></paper-toast>
            <paper-toast id='toast2' text='Logged In successfully!!!'></paper-toast>

            <iron-ajax id='ajax' handle-as='json' on-response='_handleResponse' on-error='_handleError' content-type='application/json'></iron-ajax>
        `;
    }
    /**
     * Properties used here are defined here with some respective default value.
     */
    static get properties() {
        return {
            loggedInUser: {
                type: Array,
                value: []
            },
            action: {
                type: String,
                value: 'list'
            }
        };
    }



    /**
     *  Log In validations are implemented here
     *  validates if the user exist and logs in to the user portal
     */
    _handleLogin() {
        if (this.$.loginForm.validate()) {
            let loginPostObj = { phoneNumber: parseInt(this.$.username.value), password: this.$.password.value };
            this.$.loginForm.reset();
            this.action = 'list';
            this._makeAjax(`http://10.117.189.181:9090/givetohand/login`, 'post', loginPostObj);
        }
    }



    /**
     * @param {*} event 
     * handling the response for the ajax request made
     */
    _handleResponse(event) {
        switch (this.action) {
            case 'list':
                this.loggedInUser = event.detail.response;
                /**
                 * if the successful response is returned
                 */
                if (this.loggedInUser.statusCode === 200) {
                    sessionStorage.setItem('doctorId', this.loggedInUser.userId);
                    sessionStorage.setItem('doctorName', this.loggedInUser.name);
                    this.dispatchEvent(new CustomEvent('refresh-dashboard', { detail: {}, bubbles: true, composed: true }));
                    this.$.toast2.open();
                }

                /**
                 * handling the exception
                 */
                else {
                    this.$.toast0.open();
                }
                break;
            default: break;
        }
    }

    /**
     * handling error
     */
    _handleError() {
        this.$.toast1.open();
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
window.customElements.define('login-page', LoginPage);