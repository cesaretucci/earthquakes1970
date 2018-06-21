import { Component } from '@angular/core';
import { CompleterService, CompleterData , CompleterItem} from 'ng2-completer';

import { Tab } from '../tabs/tab.interface';
import { TabComponent } from '../tabs/tab.component';
import { TabsComponent } from '../tabs/tabs.component';

import {ReadJsonService} from "../../services/readjson.service";
import {Location} from '../../core/location.class';
import {MapService} from '../../services/map.service';
import {Subject} from 'rxjs/Subject'

@Component({
    selector:'readers-panel',
    template:require<any>('./readerspanel.component.html'),
    styles: [require<any>('./readerspanel.component.less')]

})  
export class ReadersPanelComponent {
    private searchName: string;
  	private dataService: CompleterData;

  	private searchData = [];
  	private readingJson: ReadJsonService;
  	selectedName: string;
  	private locations:Array<Location>
  	private mapService: MapService;
 
  	logs:string[] = [];

  	constructor(mapService: MapService,  completerService: CompleterService, readJson:ReadJsonService) {
	    this.dataService = completerService.local(this.searchData, 'name', 'name');
	    this.readingJson = readJson;
	    this.selectedName='';
	    this.mapService=mapService;
	}

	public ngAfterViewInit():void {

		this.readingJson.getAddresses()
	        .subscribe(features => { //console.log("consol feats " +  features);
	            this.locations = features;
	            var lookup = {};
	            var readername='';

	            for (var i=0; i<this.locations.length; i++) {
	            	//console.log(this.locations[i]);
	                readername = this.locations[i].surnames;
	                if (!(readername in lookup)) {
	                  lookup[readername] = 1;
	                  this.searchData.push({'name': this.locations[i].surnames});
	                }
	            }
	        },error=> console.log(error));

	    this.mapService.selectedName.next('none');
  	}


    public onNameSelected(selected:CompleterItem) {
    	if(selected){
	      this.selectedName = selected.title;
	      //console.log("this is the selected element:" +selected.title);
	      this.mapService.selectedName.next(this.selectedName);
	      this.mapService.searchCriteriaChanged();
    	}
	    else {
	      //console.log("Nothing selected");
	      //this.selectedStreet = '';
	      this.mapService.selectedName.next('none');
	      this.mapService.searchCriteriaChanged();
	    }
	}

/*
	readersListChanged(e):void {
		this.mapService.selectedName.next(e);
	    this.mapService.searchCriteriaChanged();
	}

	resetQueryClicked():void{
		this.mapService.selectedName.next('none');
	    this.mapService.searchCriteriaChanged();
	}
*/
	
	log(selectedTab:Tab) {
    	this.logs.push('Selected Tab with title: ' + selectedTab.tabTitle);
  	}
}