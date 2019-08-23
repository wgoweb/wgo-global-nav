import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName,
} from '@microsoft/sp-application-base';
//import { Dialog } from '@microsoft/sp-dialog';
import { SPHttpClient, SPHttpClientBatch, SPHttpClientResponse } from '@microsoft/sp-http';


import * as strings from 'WgoGlobalNavApplicationCustomizerStrings';

import * as $ from 'jquery';

import { SPComponentLoader } from '@microsoft/sp-loader';

import 'jqueryui';

import { sp, Items } from "@pnp/sp";

import styles from './AppCustomizer.module.scss';

const LOG_SOURCE: string = 'WgoGlobalNavApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IWgoGlobalNavApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
  Top: string;
  Bottom: string;
}
export interface GlobalNav {
  Title?: string;
  Url?: string;
  Header?: string;


}
export interface GlobalNavList {
 value: GlobalNav[];


}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class WgoGlobalNavApplicationCustomizer
  extends BaseApplicationCustomizer<IWgoGlobalNavApplicationCustomizerProperties> {

    private _topPlaceholder: PlaceholderContent | undefined;


  @override
  public onInit(): Promise<void> {
    
    this._getSubMenus();
    
    console.log('Available placeholders: ',
    this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));
    SPComponentLoader.loadCss('https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.min.css');
    
    //this._getBenefitsLinks()

    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    if (!this._topPlaceholder) {
      this._topPlaceholder = 
        this.context.placeholderProvider.tryCreateContent (
          PlaceholderName.Top);
          //{onDispose: this.onDispose});
        }
    if (!this._topPlaceholder) {
          console.error('The expected placeholder (Top) was not found.');
          return;
        }
    if (this.properties) {
      let topString: string = this.properties.Top;
      if (!topString) {
        topString = '(Top property was not defined.)';
      }

      if(this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `
        
        <style>
        
        /* Clearfix for the menu */
        .ui-widget-content a {
          text-decoration: none;
        }
        .ui-menu:after {
            content: ".";
            display: block;
            clear: both;
            visibility: hidden;
            line-height: 0;
            height: 0;
        }
        .ui-menu .ui-menu-item {
            display: inline-block;
            float: left;
            
            padding: 15px;
            width: auto;
        }

        .ui-menu .ui-menu-item ul  {
          width: 250px;
          display: inline-block;
          float: none;
          margin-left: 50px;
          
         

        }
        .ui-menu .ui-menu-item ul li a {
          width: 250px;
          display: inline-block;
          float: none;

        }
        .ui-state-active a,.ui-state-active a:link, .ui-state-active a:visited {
          color: #000000;
        }
        .ui-state-active ul li {
          background: none;
        }
        .ui-state-active a:hover {
          background: none;
        }
        .ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus, .ui-button:hover, .ui-button:focus {
          border: none;
          background: none;
        }
        .ui-widget {
            font-family: inherit;
            font-size: inherit;
        }
        
        
        </style>
        <div style="float: left; margin-left: 15px; margin-top: 10px">
          <div><img src="https://winnebagoind.sharepoint.com/sites/HumanResources/SiteAssets/logos/Winnebago-ind-250.jpg" height="35px" width="125px"></div>
        </div>
        <div>
        <ul id="menu">
        <li><a href="https://winnebagoind.sharepoint.com/_layouts/15/me.aspx?v=profile">Directory</a></li>
        <li>Departments
            <ul>
              <li><a href="https://winnebagoind.sharepoint.com/sites/it-dept/SitePages/Home.aspx">Information Technology</a></li>
            </ul>
          </li>
          <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Winnebago-Locations.aspx">Locations</a>
            <ul>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Enterprise.aspx?web=1">Enterprise</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Motorhome.aspx?web=1">Winnebago Motorhome</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/WGO-Towables.aspx?web=1">Winnebago Towables</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Grand-Design.aspx">Grand Design RV</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Chris-Craft.aspx">Chris-Craft</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Specialty-Vehicle.aspx?web=1">Specialty Vehicles</a></li>
            </ul>
          </li>
          <li><a href="https://winnebagoind.service-now.com/sp">IT Service Desk</a></li>
          <li>Tools and Links
            <ul>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/Templates%20and%20Documents?web=1">Forms and Templates</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Policies-and-Procedures.aspx?web=1">Policies and Procedures</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/My-Apps-and-Links.aspx">My Apps and Links</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/_layouts/15/Events.aspx?ListGuid=595b423b-2f8c-4929-86a8-7f575059961d&web=1">Upcoming events</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Collaboration.aspx">Collaboration</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/_layouts/15/me.aspx?v=profile">Directory and Org Chart</a></li>
            </ul>
          </li>
          <li><a href="">Business Units</a>
            <ul>  
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/">Enterprise</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/WinnebagoMotorized">Motorhome</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/WinnebagoTowables">Towables</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Grand-Design.aspx">Grand Design RV</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/employees/SitePages/Chris-Craft.aspx">Chris-Craft</a></li>
              <li><a href="https://winnebagoind.sharepoint.com/sites/SpecialtyVehicles">Specialty Vehicles</a></li>
            </ul>
          </li>
        </ul>
        </div>
        
        `;

       
          //${escape(topString)}
        // JQUERY UI 

          $( function() {
            $( "#menu" ).menu({
              'position': {
                my:'center top',
                at: 'right bottom'
              }
            });
          } );
          // JQUERY
          $(function(){

            $("ul.dropdown li").hover(function(){
            
                $(this).addClass("hover");
                $('ul:first',this).css('visibility', 'visible');
                console.log("FIRST")
            
            }, function(){
            
                $(this).removeClass("hover");
                $('ul:first',this).css('visibility', 'hidden');
                console.log("SECOND")
            
            });
            
            $("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");
            console.log('This a href is working')
          });

    }
  }

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    //Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

    return Promise.resolve();
  }
  private async _getBenefitsLinks(subGroup: string[]) {
    //let leftLinks: any[];
    let navLinks: string;
    const spHttpClient: SPHttpClient = this.context.spHttpClient;
    const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;
    this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('GlobalNavMenu')/items`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      //var reactHandler = this;
        response.json().then((benefit: any) => {
          var benefits = benefit.value;
          console.log("Benefits: " + benefits)
          benefits.forEach(benefit => {
            console.log("Benefits: " + benefit.Title)
          })
        })
      })
    
      
    }
  
  
  private async _getBenefitsSubLinks(subGroup: string[]) {
    //let leftLinks: any[];
    let navLinks: string;
    const spHttpClient: SPHttpClient = this.context.spHttpClient;
    const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;
    this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('GlobalNavMenu')/items?$filter=SubGroup eq '` + subGroup + `'`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse) => {
      //var reactHandler = this;
        response.json().then((benefit: any) => {
          var benefits = benefit.value;
          console.log("Benefits: " + benefits)
          benefits.forEach(benefit => {
            console.log("Benefits: " + benefit.Title)
          })
        })
      })
    
      
    }
  
  
  

  private async _getSubMenus() {
    let html: string = '';
    let benefitNames: string[] = ['Departments'];
    await this._getBenefitsLinks(benefitNames);
    await this._getBenefitsSubLinks(benefitNames);

    
    
    /*defaultReports.forEach((report: GlobalNav) => 
      html += report.Title);
    console.log("Benefits Responses : " + html);*/
    //let subNavs: string = '';
      
      //response.json();
  

  }
  /*private async _getSubMenus() {
    let html: string = '';
    let benefitNames: string[] = ['Departments'];
    let benefits: GlobalNav[] = await this._showBenefitLinks(benefitNames);
      
    benefits.forEach((benefit: GlobalNav) => 
      html += benefit.Title);
    console.log("Benefits Responses : " + html);
    //let subNavs: string = '';
      
      //response.json();
  

  }
  
  private async _showBenefitLinks(benefitLinks: string[]):Promise<GlobalNav[]> {
    const arrayOfBenefits: GlobalNav[] = [];
    //const spBatch: SPHttpClientBatch = this.context.spHttpClient.beginBatch();
    const benefitResponses: Promise<SPHttpClientResponse>[] = [];
    
    
    for (const benefitLink of benefitLinks) {
      const getBenefitsList: Promise<SPHttpClientResponse> =this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('GlobalNavMenu')/items?$filter=SubGroup eq'` + benefitLink + `'`, SPHttpClient.configurations.v1)
      benefitResponses.push(getBenefitsList);
    }
    //await spBatch.execute();

    for (let benefitResponse of benefitResponses) {
      let itemResponse:SPHttpClientResponse = await benefitResponse;
      let responseJSON: GlobalNav = await itemResponse.json();
      console.log("RESP JSON :" + responseJSON);
      arrayOfBenefits.push(responseJSON)
    }
    return arrayOfBenefits;

      
     
    }*/

  }

