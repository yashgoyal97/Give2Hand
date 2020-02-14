import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';

setPassiveTouchGestures(true);
setRootPath(MyAppGlobals.rootPath);

/**
 * @customElement
 * @polymer
 */
class Give2HandApp extends PolymerElement {
  static get template() {
    return html`
    <app-location route="{{route}}" url-space-regex="^[[rootPath]]" use-hash-as-path></app-location>
    <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}"></app-route>     
    <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
      <home-page name="home"></home-page>
      <scheme-page name="scheme" selected-scheme={{selectedScheme}} scheme-data={{schemeData}}></scheme-page>
      <view404-page name='view404'></view404-page>
    </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object,
      selectedScheme:{
        type:Object,
        value:{}
      },
      schemeData:{
        type:Object,
        value:{}
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  /**
  * 
  * @param {String} page 
  */
  _routePageChanged(page) {
    if (!page) {
      this.page = 'home';
    } else if (['home', 'scheme'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }
  }

  ready(){
    super.ready();
    this.addEventListener('display-scheme',function(event){
      this.selectedScheme=event.detail.item;
    });
    super.ready();
    this.addEventListener('send-scheme',function(event){
      this.schemeData=event.detail.item;
      console.log(this.schemeData,"scheme page");

    });
  }

  /**
   * 
   * @param {String} page 
   */
  _pageChanged(page) {
    switch (page) {
      case 'home':
        import('./home-page.js');
        break;
      case 'scheme':
        import('./scheme-page.js');
        break;
      case 'view404':
        import('./view404-page.js');
        break;
    }
  }
}

window.customElements.define('donation-app', Give2HandApp);
