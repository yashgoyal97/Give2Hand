import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/gold-cc-input/gold-cc-input.js';
import '@polymer/iron-icons/iron-icons.js';
import 'highcharts-chart/highcharts-chart.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';



/**
* @customElement
* @polymer
*/
class AdminPage extends PolymerElement {
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
    td{
        padding:10px;
    }
</style>
<div class="container">
    <header>
        <div id="logo"><h2>Give2Hand<iron-icon icon="all-out"></iron-icon></h2></div>
        <paper-button id="goToHomeBtn" on-click="_handleLogout">LOGOUT<iron-icon icon='settings-power'></iron-icon></paper-button>
    </header>
    <main>
        <highcharts-chart type="pie" data="{{schemeData}}" color-by-point=true on-click="_handleChart" title="Scheme Statistics"></highcharts-chart>
        <paper-dialog id='chartDialog'>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Phone</td>
                        <td>Email</td>
                        <td>PAN</td>
                        <td>Tax Benefit</td>
                        <td>Payment Type</td>
                        <td>Amount</td>
                    </tr>
                </thead>
                <tbody>
                    <template is="dom-repeat" items="{{schemeTable}}">
                        <tr>
                            <td>{{item.userName}}</td>
                            <td>{{item.phoneNumber}}</td>
                            <td>{{item.mailAddress}}</td>
                            <td>{{item.panNumber}}</td>
                            <td>{{item.taxBenfit}}</td>
                            <td>{{item.amount}}</td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </paper-dialog>
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
                type: Array,
                value: []
            },
            schemes: {
                tyep: Array,
                value: []
            },
            percentage: {
                tyep: Array,
                value: []
            },
            count: {
                tyep: Array,
                value: []
            },
            name: {
                tyep: Array,
                value: []
            },
            schemeDetail: {
                type: Object,
                value: {}
            },
            schemeTable: {
                type: Array,
                value: []
            }
        }
    }

    _handleChart(event) {
        console.log(event.point.options);
        this.schemeDetail = event.point.options;
        this.action = 'table'
        this._makeAjax(`http://10.117.189.181:9090/givetohand/schemes/${this.schemeDetail.schemeId}`, 'get', null);
        this.$.chartDialog.open();
    }

    connectedCallback() {
        super.connectedCallback();
        this.action = 'chart'
        this._makeAjax('http://10.117.189.181:9090/givetohand/schemes/chart', 'get', null);
    }

    _handleRefreshAdmin() {
        console.log(sessionStorage.getItem('userId'));
        console.log(sessionStorage.getItem('userName'));
        this.action = 'chart'
        this._makeAjax('http://10.117.189.181:9090/givetohand/schemes/chart', 'get', null);
    }

    _handleResponse(event) {
        switch (this.action) {
            case 'chart':
                this.schemeData = event.detail.response.schemes;
                console.log(this.schemeData);
                break;
            case 'table':
                this.schemeTable = event.detail.response.donors;
                break;
        }
    }

    _handleLogout() {
        sessionStorage.clear();
        window.history.pushState({}, null, '#/login');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

    _makeAjax(url, method, postObj) {
        let ajax = this.$.ajax;
        ajax.url = url;
        ajax.method = method;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }
}

window.customElements.define('admin-page', AdminPage);