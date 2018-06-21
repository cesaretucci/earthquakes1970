import {Component} from '@angular/core';

import {MapService} from '../../services/map.service';
import {ReadJsonService} from "../../services/readjson.service";
//import {Location} from '../../core/location.class';

import { ReadersPanelComponent } from '../readerspanel/readerspanel.component';
@Component({
    selector: 'sidebar',
    template: require<any>('./sidebar.component.html'),
    styles: [require<any>('./sidebar.component.less')],
    providers:[]
})

export class SidebarComponent {
  private searchData = [];
  private mapService: MapService;

  constructor(mapService: MapService,readJson:ReadJsonService) {
    this.mapService=mapService;
  }


  public resetCriteria():void{
    //alert("reset clickato");
    this.mapService.selectedStreet.next('none');
    this.mapService.selectedName.next('none');
    this.mapService.searchCriteriaChanged();
    

  }
//sort addresses alphabetically
//adresses by range, radio
//range query
//give them a short list
//idea: subscribe to service and call a funcion named updatemap in the service?

}