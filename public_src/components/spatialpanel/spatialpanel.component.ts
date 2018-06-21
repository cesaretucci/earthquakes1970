import { Component, ElementRef, ViewChild } from '@angular/core';
import { Tab } from '../tabs/tab.interface';
import { TabComponent } from '../tabs/tab.component';
import { TabsComponent } from '../tabs/tabs.component';

import { CompleterService, CompleterData , CompleterItem, CompleterCmp} from 'ng2-completer';
import {ReadJsonService} from "../../services/readjson.service";
import {Location} from '../../core/location.class';
import {MapService} from '../../services/map.service';
import {Subject} from 'rxjs/Subject'


@Component({
  selector: 'spatial-panel',
  template: require<any>('./spatialpanel.component.html'),
      styles: [require<any>('./spatialpanel.component.less')]
})
export class SpatialPanelComponent{

  @ViewChild("streetInput") private streetInput : CompleterCmp;

  private searchStr;
  private searchCounty: string;
  private searchCountry: string;
  private searchRegion: string;
   
  public focusStreet: false;


  private dataService: CompleterData;
  private dataServiceCounty: CompleterData;
  private dataServiceCountry : CompleterData;

  private searchData = [];
  private searchDataCounty = [];
  private searchDataCountry = [];

  private readingJson: ReadJsonService;
  selectedStreet: string;
  private locations:Array<Location>
  private mapService: MapService;
 
  logs:string[] = [];

  selectedTab : String;

  //filtered locations
  /*
  private filterStreetSource = new Subject<string>();
  filterStreet$ = this.filterStreetSource.asObservable();
  */

  constructor(mapService: MapService,private completerService: CompleterService,readJson:ReadJsonService, private elRef:ElementRef) {
    this.dataService = completerService.local(this.searchData, 'street', 'street');
    this.dataServiceCounty = completerService.local(this.searchDataCounty, 'county', 'county');
    this.dataServiceCountry = completerService.local(this.searchDataCountry, 'country', 'country');
    this.readingJson = readJson;
    //this.selectedStreet='';
    this.mapService=mapService;
  }

  ngAfterViewInit() {
    
    this.readingJson.getAddresses()
        .subscribe(features => { //console.log("consol feats " +  features);
            this.locations = features;
            var lookup = {};
            var streetname='';
            var county='';
            var country='';

            for (var i=0; i<this.locations.length; i++) {

                streetname = this.locations[i].address;
                if (!(streetname in lookup)) {
                  lookup[streetname] = 1;
                  this.searchData.push({'street': this.locations[i].address});
                }

                county = this.locations[i].county;
                if (!(county in lookup)) {
                  lookup[county] = 1;
                  this.searchDataCounty.push({'county': this.locations[i].county});
                }

                country = this.locations[i].country;
                if(!(country in lookup)){
                  lookup[country] = 1;
                  this.searchDataCountry.push({'country': this.locations[i].country});
                }

                //the DUBLIN REGIONS/DISCRICT attribut needs to be loaded here like all the others

              }
        },error=> console.log(error));

        this.mapService.selectedStreet.next('none');
        this.mapService.selectedPlaceTable.next('Streets');
        
  }

  public onStreetSelected(selected:CompleterItem) :void{
    if(selected){
      this.selectedStreet = selected.title;
      this.mapService.selectedStreet.next(this.selectedStreet);
      this.mapService.searchCriteriaChanged();
    }
    else {
      this.mapService.selectedStreet.next('none');
      this.mapService.searchCriteriaChanged();
    }
  }



  panelChanged(selectedTab:Tab) :void{
    //console.log(selectedTab.tabTitle);
    //this.selectedTab = selectedTab.tabTitle;
    this.mapService.selectedPlaceTable.next(selectedTab.tabTitle);
    this.searchStr = ''; 
    this.searchRegion = '';
    this.searchCounty = '';
    this.searchCountry = '';
    this.mapService.selectedStreet.next('none');
    this.mapService.searchCriteriaChanged();    
  }


  load(selectedTab:Tab) {
    this.logs.push('Selected Tab with title: ' + selectedTab.tabTitle);
    //chceck if selected tab is the one we are looking for
    // if list is populated, don't do it
    //otherwise, populate it
    //think of what to do when ther will be updates on running time
  }

  log(selectedTab:Tab) {
    //not used
    this.logs.push('Selected Tab with title: ' + selectedTab.tabTitle);
  }

}