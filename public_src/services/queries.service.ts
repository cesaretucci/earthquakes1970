import {Injectable} from "@angular/core";
import {Http} from '@angular/http';


@Injectable()
export class QueryService {
    cartoDBUserName: String = "Lixseven";
    endpoint_url: String = "https://"+ this.cartoDBUserName +".cartodb.com/api/v2/sql?format=GeoJSON&q=";
    http: Http;
    
    constructor(http: Http) {
        this.http = http;
    }
    
    
    getLocations (query: string){
        return this.http.get(this.endpoint_url + query).map(res => res.json());
         //   .map(result => {
            //    console.log(result); console.log(result.features);
         //   } );
    }
    
}


/*


    .map(res => res.json())
            .map(result => {
                if(result.status != 'OK') { throw new Error('unable to geocode address'); }

                var location = new Location();
                location.address = result.results[0].formatted_address;
                location.latitude = result.results[0].geometry.location.lat;
                location.longitude = result.results[0].geometry.location.lng;

                var viewPort = result.results[0].geometry.viewport;
                location.viewBounds = new LatLngBounds(
                  {
                    lat: viewPort.southwest.lat,
                    lng: viewPort.southwest.lng},
                  {
                    lat: viewPort.northeast.lat,
                    lng: viewPort.northeast.lng
                  });

                return location;
            });

*/
