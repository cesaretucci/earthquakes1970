
import {Injectable} from "@angular/core";
import {Http,Headers,RequestOptions,Response} from '@angular/http';
import {Location} from '../core/location.class';
import {Observable} from 'rxjs/Rx'
@Injectable()
export class ReadJsonService {
    http: Http;
    public addresses;
    public showAddresses;
    public selectedStreet;
    public locations:Array<Location>;
    public all_locations:Array<Location>; //inclduing those which do not have lat and lon

    public readerInfo: any;

    constructor(http: Http) {
        this.http = http;
    }

    getAddresses() {
   //      let headers = new Headers();
    //headers.append('Accept', 'q=0.8;application/json;q=0.9');
    let headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({headers:headers});
    var points: any=[];
    if (this.locations){
        return Observable.of(this.locations);   //what does it mean?
    }
    else {
        return this.http.get('../addressesv10.json')
        // .map(this.extractData)
        .map( (responseData) => {
            return responseData.json();
            })
        .map((pairs: Array<any>) => {
            let result:Array<Location> = [];
            if (pairs){
                pairs.forEach((pair)=>{
                    var loc = new Location();
                    loc.latitude=pair.lat;
                    loc.longitude = pair.lon;
                    loc.address=pair.streetname;
                    loc.forenames=pair.forenames;
                    loc.surnames = pair.surnames;
                    loc.recordnumber=pair.record_number;
                    loc.reader_id = pair.reader_id;


                    var dateStr = pair.date;
                    var splitted = dateStr.split("-");
                    //console.log(splitted);
                    loc.date= new Date(splitted[0]+"-"+splitted[1]+"-"+splitted[2]); //year-month-day
                   // loc.readabledate = this.getReadableDate(loc.date);
                    loc.city = pair.city;
                    loc.county = pair.county;
                    loc.country = pair.country;
                    loc.recordpics=pair.pics;
                    var housenum = +pair.housenumber;
                    loc.housenumber=''+ Math.round(housenum);
                    result.push(loc);
                });
                this.all_locations=result;
                result=result.filter(location => (typeof location.latitude === 'number') && (typeof location.longitude === 'number'));
                this.locations=result;

                //console.log(result);
                //console.log(this.locations);
                //filter stuff here
            }
            return result;
        });
    }
      /*.subscribe(
        data => { this.foods = data},
        err => console.error(err),
        () => console.log('done')
      );
    */
    }



    getReadersInfo() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    var options = new RequestOptions({headers:headers});
    var points: any=[];
    if (this.readerInfo){
        return Observable.of(this.readerInfo);   //what does it mean?
    }
    else {
        return this.http.get('../readers_testjson6.json')
        // .map(this.extractData)
        .map( (responseData) => {
            return responseData.json();
            })
        .map((pairs: Array<any>) => {
            let result:Array<Location> = [];
            if (pairs){
                pairs.forEach((pair)=>{

                    var readerInfo = new Object();

                    readerInfo.id = pair.id;
                    readerInfo.forenames = pair.forenames;
                    readerInfo.surnames = pair.surnames;
                    readerInfo.title_prefix = pair.title_prefix;
                    readerInfo.suffix = pair.suffix;
                    readerInfo.postnominal_title = pair.postnominal_title;
                    readerInfo.gender = pair.gender;
                    readerInfo.occupation = pair.occupation;
                    readerInfo.notes = pair.notes;
                    readerInfo.referee = pair.referee;
                    readerInfo.visits_ids = pair.visit_ids;
                    result.push(readerInfo);
                    
                });
                this.readerInfo=result;
            }
            return result;
        });
    }
      
    }

    getReadableDate(thisDate):string{
        var newDate = thisDate.getDate() + "/" + (thisDate.getMonth()+1) + "/" + thisDate.getFullYear();
        return newDate;
    }

    setSelectedStreet(street: String) {
        this.selectedStreet=street;
    }

      private extractData(res: Response) {
    let body = res.json();
    //console.log(body);
    return body.data || { };
  }
}