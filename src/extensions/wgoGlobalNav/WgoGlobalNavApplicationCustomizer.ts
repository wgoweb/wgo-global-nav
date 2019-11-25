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
// Use the component loader for adding external Javascript, like jQuery UI
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
    
    console.log('Available placeholders: ',
    this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));
   // Here is the component loader for jQuery UI
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
        .ui-widget-content{
          border: none;
        }
        
        
        </style>
        
        <div id="testList"></div>
        `;
        // Call the main manu section
        this._getBenefitsLinks();
      
    }
  }

    let message: string = this.properties.testMessage;
    if (!message) {
      message = '(No properties were provided.)';
    }

    //Dialog.alert(`Hello from ${strings.Title}:\n\n${message}`);

    return Promise.resolve();
  }
  private async _getBenefitsLinks() {
    console.log("GET BENEFITS RUN")
    //let leftLinks: any[];
    var b: number = 0;
    let html: string = "";
    let navLinks: string;
    const spHttpClient: SPHttpClient = this.context.spHttpClient;
    const currentWebUrl: string = this.context.pageContext.web.absoluteUrl;
    html += `
    <div>
    <ul class="menu">
    `
    // This calls the SharePoint Rest API
    this.context.spHttpClient.get(`https://winnebagoind.sharepoint.com/sites/HumanResources/_api/web/lists/getByTitle('GlobalNavMenu')/items`, SPHttpClient.configurations.v1)
    .then((response: SPHttpClientResponse): Promise<any> => {
      //var reactHandler = this;
        
      return response.json()})
        .then((benefit: any): void => {
          //var benefits = benefit.value;
          console.log(benefit)

          var a: number = 0;
          var subNav = { menus:[] };
          html += 
          `<div style="float: left; margin-left: 15px; margin-top: 10px">
          <div><img src="https://winnebagoind.sharepoint.com/sites/HumanResources/SiteAssets/logos/Winnebago-ind-250.jpg" height="35px" width="125px"></div>
        </div>`;
          benefit.value.forEach(ben => {
            var num = 0; 
            var subGroup = benefit.value[a].SubGroup;
            console.log('SUBHEAD: ' + subGroup);
            // Find headers with no SubMenus
            if(benefit.value[a].Header == "No" && benefit.value[a].SubHead == "No"){
            //console.log("NO: " + benefit.Title)
              html +=
              `
              <li><a href="${benefit.value[a].Url}">${benefit.value[a].Title}</a></li>
              `
            }
            
            // Loop through and find the menus that are headers to Submenus
            if(benefit.value[a].Header == "Yes") {
        
              html +=
              // For each on e build the list item and a sub list ul
              // Note that we dynamically add an ID with the SubHead so that the jQuery function below can find the dom element
              `
              <li>${benefit.value[a].Title}
                <ul id="${benefit.value[a].SubGroup}" class="subMenu"></ul>
              `;
                         
            }
            // Build a new array here for all of the items that are subheaders
            if (benefit.value[a].SubHead == "Yes") {
              console.log('NEW SUBHEAD: ' + benefit.value[a].Title);
              subNav.menus.push({
                "Title" : benefit.value[a].Title,
                "Url" : benefit.value[a].Url,
                "SubGroup" : benefit.value[a].SubGroup 
              })

            }
            // Increment the array
            a++;
          });
          //console.log(html);
          //console.log("SUBNAV ARRAY: " + subNav)
          
         // Close the list
          html+=
          `</ul></div>`;
          // For each SubMenu, append it to the created HTML above if the ID matchesd the SubGroup
          $('#testList').html(html);
          subNav.menus.forEach(function(e) {
            console.log("SUBNAV RESULT " + subNav.menus[b].Title + 'SUBGROUP NAME: ' + subNav.menus[b].SubGroup);
            $('#' + subNav.menus[b].SubGroup).append('<li class="subMenuLi"><a href="' + subNav.menus[b].Url + '">' + subNav.menus[b].Title + '</li>');
            //$("#Departments").append('<li class="subMenuLi"><a href="' + subNav.menus[b].Url + '">' + subNav.menus[b].Title + '</a></li>');

            b++;
          });
          $( function() {
            $( ".menu" ).menu({
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
         
        },
        (error: any): void => {
        console.log('Loading user details failed with error: ' + error);
          
        })
      
    
      

    }
  
  
 
  
  

  }

