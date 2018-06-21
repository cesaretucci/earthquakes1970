import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule} from '@angular/forms'
import {NgModule, Component, Pipe, OnInit, DoCheck, HostListener, Input, ElementRef, Output, EventEmitter, forwardRef, IterableDiffers} from '@angular/core'
import {HttpModule} from '@angular/http';
//import { Typeahead } from '../node_modules/ng2-typeahead/src/ng2-typeahead';
//import { MyDatePickerModule } from 'mydatepicker';
//import { DatepickerModule } from 'angular2-material-datepicker'
//import { DatepickerModule } from 'ngx-bootstrap/components/datepicker';
import {AppComponent} from './components/app/app.component';
//import { NavigatorComponent } from './components/navigator/navigator.component'
import {MarkerComponent} from './components/marker/marker.component'
import {SidebarComponent} from './components/sidebar/sidebar.component'

import {MapAreaComponent} from './components/maparea/maparea.component';
import {TempPanelComponent} from './components/temppanel/temppanel.component'
import {TabComponent} from './components/tabs/tab.component';
import { TabsComponent } from './components/tabs/tabs.component';
//import { TabsPanelComponent} from './components/tabs/tabspanel.component';
import { ReadersPanelComponent} from './components/readerspanel/readerspanel.component';
import { DetailPanelComponent} from './components/detailpanel/detailpanel.component';
import { SpatialPanelComponent } from './components/spatialpanel/spatialpanel.component';

import { VizOptionsPanelComponent } from './components/vizoptionspanel/vizoptionspanel.component';
import { ModalComponent } from './components/modal/modal.component';
//import {ImageModal} from "angular2-image-popup";
import {ImageModal} from '../node_modules/angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
import {TempSliderComponent} from './components/tempslider/tempslider.component';

import {IsdDatepickerComponent} from './components/isddatepicker/isddatepicker.component';
import {DateConversion} from './components/isddatepicker/dateconversion.pipe';

import {MapService} from './services/map.service';
import {GeocodingService} from './services/geocoding.service';
import {QueryService} from "./services/queries.service";
import {ReadJsonService} from "./services/readjson.service";

import { Ng2CompleterModule } from "ng2-completer";

import { MyDateRangePickerModule } from 'mydaterangepicker';

import "leaflet.heat";

import "../own/jquery/jquery-3.2.1.min.js";

import "../own/jquery/jquery-ui.min";
import "../own/jquery/jquery-ui.css";

import "../own/w3css/w3.css";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";


//bootstrap(AppComponent, [HTTP_PROVIDERS, MapService, GeocodingService, QueryService,ReadJsonService])
//.catch(err => console.error(err));

@NgModule({
    declarations: [AppComponent, MarkerComponent, SidebarComponent,MapAreaComponent, IsdDatepickerComponent,DateConversion, TempPanelComponent, TabComponent, TabsComponent, ReadersPanelComponent, DetailPanelComponent, VizOptionsPanelComponent,SpatialPanelComponent, ModalComponent, TempSliderComponent],
    imports:      [BrowserModule, FormsModule, HttpModule, Ng2CompleterModule, MyDateRangePickerModule],
    bootstrap:    [AppComponent],
    providers:    [MapService, GeocodingService, ReadJsonService, QueryService]
})
//I may have to change this to adhere to the styleguide

//maybe this thing should not be here, I'll try to fix it
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);