import {ILatLng} from './latLng.interface';
import {LatLngBounds} from 'leaflet';

export class Location implements ILatLng {
    latitude: number;
    longitude: number;
    address: string;
    viewBounds: LatLngBounds;
    //for the time being these will go hererecordnumber : string;
    forenames: string;
    surnames: string;
    wholeaddress: string;
    recordnumber:string;
    housenumber:string;
}
