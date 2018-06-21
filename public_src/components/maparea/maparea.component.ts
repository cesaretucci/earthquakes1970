
import {Component, ViewChild} from '@angular/core';
import {MapService} from '../../services/map.service';
import {GeocodingService} from '../../services/geocoding.service';
import {Location} from '../../core/location.class';
import {QueryService} from "../../services/queries.service";
import {ReadJsonService} from "../../services/readjson.service";
import {MarkerComponent} from '../marker/marker.component';
import {Icon} from 'leaflet';

@Component({
    selector: 'map-area',
    template: require<any>('./maparea.component.html'),
    styles: [
        require<any>('./maparea.component.less')
    ]
})

export class MapAreaComponent{
    private mapService: MapService;
    private geocoder: GeocodingService;
    private queryCartoDB: QueryService;
    private readingJson: ReadJsonService;
    private locations:Array<Location>
    selStreet:String;

    @ViewChild(MarkerComponent) markerComponent:MarkerComponent;

    constructor(mapService: MapService, geocoder: GeocodingService, queryCartoDB:QueryService,readJson:ReadJsonService) {
        this.mapService = mapService;
        this.geocoder = geocoder;
        this.queryCartoDB=queryCartoDB;
        this.readingJson=readJson;
    }


    ngOnInit():void {

      L.Icon.Default.imagePath='../../../node_modules/leaflet/dist/images';

      var map = new L.Map('map', {
        zoomControl: false,
        center: new L.LatLng(53.34204355,-6.26736170056302),
        zoom: 14,
        minZoom: 1,
        maxZoom: 17,
       // layers: [this.mapService.baseMaps.OpenStreetMap]
       layers: [this.mapService.baseMaps.CartoDB]
      });

      L.control.zoom({ position: 'topleft' }).addTo(map);
      // L.control.layers(this.mapService.baseMaps).addTo(map);
      L.control.scale().addTo(map);

      var libraryIcon = L.icon({
        iconUrl: '../own/images/marker-icon-2x-library.png',
        shadowUrl: '../own/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      L.marker([53.3391947,-6.27054088205656], {icon: libraryIcon}).addTo(map).bindPopup("Marsh's Library").openPopup();

      this.mapService.map = map;
    }//ngOnInit() closing

  
  onClick(e){
        console.log( e+ "in the map component");
    }

  
  ngAfterViewInit() {
  /*
    this.markerComponent.Initialize();
    //js code
    var cartoDBUserName = "Lixseven";
    var locationMarker = null;
    var sqlQuery = "SELECT * FROM coffee_cafes";
    var places=[];
    var error="";
  */
       
  
  /*
     this.queryCartoDB.getLocations(sqlQuery)
        .subscribe(
            features => { console.log(features); L.geoJson(features, {onEachFeature: function (feature, layer) {
                console.log(feature);
            layer.bindPopup('<p><b>' + feature.properties.name + '</b><br /><em>' + feature.properties.address + '</em></p>');
            layer.cartodb_id=feature.properties.cartodb_id;
          }}).addTo(map);},
            error => error = sqlQuery + "is invalid");

  */

  //here start another piece of code

  /*
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }; 
  */
  }//ngAfterView() Closing
}//class component closing