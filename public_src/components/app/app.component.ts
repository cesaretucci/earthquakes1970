/// <reference path="../../../typings/globals/leaflet/index.d.ts"/>

import {Component, ViewChild} from '@angular/core';
//import {NavigatorComponent} from '../navigator/navigator.component';
//import {SidebarComponent} from '../sidebar/sidebar.component';
import {MarkerComponent} from '../marker/marker.component';
/*import {MapService} from '../../services/map.service';
import {GeocodingService} from '../../services/geocoding.service';
import {Location} from '../../core/location.class';
import {QueryService} from "../../services/queries.service";
import {ReadJsonService} from "../../services/readjson.service";
*/
import {MapAreaComponent} from '../maparea/maparea.component';
import {TempPanelComponent} from '../temppanel/temppanel.component';
import { DetailPanelComponent } from '../detailpanel/detailpanel.component';

@Component({
    selector: 'app',
    template: require<any>('./app.component.html'),
    styles: [
        require<any>('./app.component.less')
    ],
    //directives: [NavigatorComponent, MarkerComponent, SidebarComponent]
    providers:[]
})
export class AppComponent {
   
   

    ngOnInit() {
       
    }


onDateChanged(event:any) {
        console.log('onDateChanged(): ', event.date, ' - formatted: ', event.formatted, ' - epoc timestamp: ', event.epoc);
    }
    
}


