import {Injectable} from '@angular/core';
import {Location} from '../core/location.class';

import {ReadersPerMonthInYear} from '../core/ReadersPerMonthInYear.class';
import {DateNumberReaders} from '../core/DateNumberReaders.class';

import {GeoRecord} from '../core/georecord.class';

import {Map, TileLayer, LeafletMouseEvent} from 'leaflet';
import {ReadJsonService} from "../services/readjson.service";
import *  as d3 from 'd3';
import {Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Subject }    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';


@Injectable()
export class MapService {
    public map: Map;
    public baseMaps: any;
    public selStreet:String;
    private readingJson: ReadJsonService;

    public self;

    //testing for d3 slider component
    public mainXScale;
    public mainYScale;
    public subXScale;
    public main;
    public sub;
    public mainArea;
    public mainXAxis;
    public mainYAxis;
    public d3Datum;
    

    public locations:Array<Location>;
    public fullLocations:Array<Location>;

    public readersPerYear: Array<ReadersYear>;
    public readersPerDate: Array<DateNumberReaders>;

    public dateForD3Slider: Array<DateNumberReaders>;
    public flagToDrawSlider = 0;

    public markersLayer;
    public heatLayer;
    public clusterLayer;
    public markersGroups:any;
    private boxesList: Array;
    public highlightedIcon;
    public standardIcon;

    private freqsperCoordinate = new BehaviorSubject(null); // [];
    private contentInTableSource = new Subject<string>();
    private recordsOnPointSource = new Subject();
    private recordsToHighlight = new Subject();
    private areDetailsShowed = new Subject();
    public isSliderShowed = new Subject();
    public selectedStreet = new Subject();
    public selectedName = new Subject();
    public selectedRange = new Subject();
    public selectedRangeFormatted = new Subject();
    public selectedStartDate = new Subject();
    public selectedEndDate = new Subject();
    private numberOfResults = new Subject();


    public selectedPlaceTable = new Subject();
    selectedPlaceTable$ = this.selectedPlaceTable.asObservable();

    public currentPlaceTable = '';
    public currentStreetName = '';
    public currentName = '',
    public currentStartDate = '';
    public currentEndDate = '';
    public currentRange = '';


    selectedRangeFormatted$ = this.selectedRangeFormatted.asObservable();
    numberOfResults$ = this.numberOfResults.asObservable();
    selectedRange$ = this.selectedRange.asObservable();
    selectedStartDate$ = this.selectedStartDate.asObservable();
    selectedEndDate$ = this.selectedEndDate.asObservable();
    selectedName$ = this.selectedName.asObservable();
    selectedStreet$ = this.selectedStreet.asObservable();
    contentInTable$ = this.contentInTableSource.asObservable();
    recordsOnPoint$ = this.recordsOnPointSource.asObservable();
    recordsToHighlight$ = this.recordsToHighlight.asObservable();
    areDetailsShowed$ = this.areDetailsShowed.asObservable();
    isSliderShowed$ = this.isSliderShowed.asObservable();

    subscription: Subscription;

    constructor(readJson:ReadJsonService) {
        this.baseMaps = {
            OpenStreetMap: new L.TileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
            }),
            Esri: new L.TileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
            }),
            CartoDB: new L.TileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
            })
        };


        this.readingJson=readJson;
        this.markersLayer=new L.LayerGroup();
        self = this;

        //MARKERICON WHEN THE MARKER IS SELECTED
        this.highlightedIcon = L.icon({
            iconUrl: '../own/images/marker-icon-2x-green.png',
            shadowUrl: '../own/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        //MAERKERICON WHEN THE MARKER LOSES THE FOCUS
        this.standardIcon = L.icon({
            iconUrl: '../own/images/marker-icon-2x-blue.png',
            shadowUrl: '../own/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        //reading from observables
        this.subscription = this.selectedStreet$.subscribe(
            currentStreetName =>{
                this.currentStreetName=currentStreetName;
                }
        );

        this.subscription = this.selectedName$.subscribe(
            currentName =>{
                this.currentName=currentName;
                }
        );

        this.subscription = this.selectedStartDate$.subscribe(
            currentStartDate =>{
                this.currentStartDate=currentStartDate;
                }
        );

        this.subscription = this.selectedEndDate$.subscribe(
            currentEndDate =>{
                this.currentEndDate=currentEndDate;
                }
        );

       this.subscription = this.selectedRange$.subscribe(
            currentRange =>{
                this.currentRange=currentRange;
                }
        );

        this.subscription = this.selectedPlaceTable$.subscribe(
            currentPlaceTable =>{
                this.currentPlaceTable=currentPlaceTable;
                }
        );
    }//constructor closed

    /*
    @Input()
    setFreqs(freqs){
        this.freqsperCoordinate=freqs;
    }

    
    getFreqs(){
        return this.freqsperCoordinate;
    }
    */

    disableMouseEvent(tag: string) {
        var html = L.DomUtil.get(tag);

        L.DomEvent.disableClickPropagation(html);
        L.DomEvent.on(html, 'mousewheel', L.DomEvent.stopPropagation);
    }; //disableMouseEvent CLOSED

////////////////////////////////HELPING FUNCTIONs///////////////////////////////////////////////////////
    
    calculateReadersPerYear():void{
        
        var locations_todraw:Array <Location>;
        this.loadFullQuery();
        locations_todraw = this.fullLocations;

        var parseDate = d3.time.format("%m %Y").parse;

        let array: ReadersPerMonthInYear[] = [];

        var y = 1826;
        var endy = 1926;

        var ind = 0;
        
        do{
            var m=1;
                for(var i=0; i<12; i++){
                    var thisYearThisMonth = locations_todraw.filter(loc => loc.date.getFullYear() == y && (loc.date.getMonth()+1) == m);
                    array[ind] = new ReadersPerMonthInYear (y,m,thisYearThisMonth.length, parseDate(m+" "+y));
                    ind++;
                    m++;
                }
            y++;
        }while(y<=endy);

        this.readersPerYear = array;
    } //calculateReadersPerYear CLOSED

    //NOT USED AT THE MOMENT
    calculateReadersPerDay():void{

        var locations_todraw:Array <Location>;
        this.loadFullQuery();
        locations_todraw = this.fullLocations;

        //console.log(locations_todraw);
        
        var startDate = new Date("1826-01-01");
        var endDate = new Date("1926-12-31");

       
        var inctrementingDate = startDate;

        let array: DateNumberReaders[] = [];

        var y = startDate.getFullYear();
        var endy = endDate.getFullYear();
        var ind = 0;
        
        do{
            var visitInThisDay = locations_todraw.filter(loc => loc.date.getTime() == inctrementingDate.getTime());
            //console.log(visitInThisDay.length);
            array[ind] = new DateNumberReaders (inctrementingDate,  visitInThisDay.length);
            inctrementingDate = new Date(inctrementingDate.getTime() + 86400000);
            
            ind++;
        }while(inctrementingDate < endDate);
        
        this.readersPerDate = array;
        console.log(array);
    }//calculateReadersPerMonth CLOSED

    calculateD3Date():void{

        var mydata = this.readersPerYear;
            
        let dataArray: DateNumberReaders[] = [];

        for(var i=0; i<mydata.length; i++){
            dataArray[i] = new DateNumberReaders (mydata[i].date, mydata[i].numberOfReaders);
        }

        this.d3Datum = dataArray;
    } //calculateD3Date CLOSED

    getRecordsPerPoint(event:MouseEvent){
            this.contentInTableSource.next("changed "+ event.latlng);     //obseervable should enter in action here
            //search for records that have this same geoloc
            let filtLocations:Array<Location>;
            //console.log("longitude " + event.latlng);
            filtLocations = this.locations.filter(loc => loc.longitude ===event.latlng.lng);
            this.recordsOnPointSource.next(filtLocations);
            //console.log(filtLocations);
    } //getRecordsPerPoint CLOSED

    // --------- OLD FUNCTION ------- Consdolidate addresses function: frequencies per location
    consolidateAdressesStreet() {
            var lookupFreqs = {};
            var coordinates={};
            var freqs=[];
            this.readingJson.getAddresses()
                .subscribe(features => { 
                    //console.log("consol feats " +  features);
                    this.locations = features;
                for (var i=0; i<this.locations.length; i++) {
                    if (!(this.locations[i].address in lookupFreqs)) {
                    lookupFreqs[this.locations[i].address] = 1;
                    coordinates[this.locations[i].address] = this.locations[i];
                    //store coordintes here
                    }
                    else {
                        lookupFreqs[this.locations[i].address] += 1;
                    }
                }
            
                Object.keys(lookupFreqs).forEach(function(key){
                    freqs.push({'type':"Feature",'name': key, 'freq': lookupFreqs[key], 'geometry':{'type':"Point",'coordinates':[coordinates[key].longitude,coordinates[key].latitude]}});
                });
                
                console.log("this is supposed to be my values: ");
                console.log(this.freqsperCoordinate);
                this.freqsperCoordinate.next(JSON.stringify({type:"FeatureCollection", features: freqs}));
              //  return freqs;
            },error=> console.log(error));
                
            //    console.log("My values outside subscribe ");
            //    console.log(this.freqsperCoordinate);
    } //consolidateAdressesStreet CLOSED

    //OLD FUNCTION is not used anymore
    calculateFrequencies(locations_todraw: Array<Location>): Array<Object>{
        var lookupFreqs = {};
        var coordinates={};
        var freqs=[];

        var LatLngArray = [];
        
        for (var i=0; i<locations_todraw.length; i++) {
            LatLngArray[i] = [locations_todraw[i].latitude, locations_todraw[i].longitude];

            if (!(locations_todraw[i].address in lookupFreqs)) {
                lookupFreqs[locations_todraw[i].address] = 1;
                coordinates[locations_todraw[i].address] = locations_todraw[i];
                //store coordintes here
            }
            else {
                lookupFreqs[locations_todraw[i].address] += 1;
            }
        }
            
        Object.keys(lookupFreqs).forEach(function(key){
            freqs.push({'type':"Feature",'name': key, 'freq': lookupFreqs[key], 'geometry':{'type':"Point",'coordinates':[coordinates[key].longitude,coordinates[key].latitude]}});
        });

        //calculate the boundaries and setting the zoom according to the number of results
        if(locations_todraw.length != 0) this.map.fitBounds(new L.LatLngBounds(LatLngArray), {maxZoom:15});
        else this.map.setView([53.34204355,-6.26736170056302], 14);

        return freqs;
    }//calculateFrequencies CLOSED
    
    saveList(source: any):void {
        //saving the tradeSource array from the vizoptionspanel (it cointains infos about the checkboxes)
        this.boxesList = source;
    } //saveList CLOSED

    loadFullQuery():void{
        //load the array with the full query locations
        this.fullLocations = this.getFullLocations();
    } //loadFullQuery CLOSED

    getFullLocations():Array<Location>{
        var features;
            this.readingJson.getAddresses()
                .subscribe(features => { 
                    this.locations = features;
                },error=> console.log(error));

        return this.locations;
    } //getFullLocations CLOSED

    calculateQuery():Array<Location>{
        
        //GET THE CURRENT SELECTED CRITERIA
        //get street
        this.subscription = this.selectedStreet$.subscribe(
            currentStreetName =>{
                this.currentStreetName=currentStreetName;
                }
        );

        //get selected place table
        this.subscription = this.selectedPlaceTable$.subscribe(
            currentPlaceTable =>{
                this.currentPlaceTable=currentPlaceTable;
                }
        );

        //get name
        this.subscription = this.selectedName$.subscribe(
            currentName =>{
                this.currentName=currentName;
                }
        );

        //getRange
        this.subscription = this.selectedRange$.subscribe(
            currentRange =>{
                this.currentRange=currentRange;
                }
        );

        //get start date
        this.subscription = this.selectedStartDate$.subscribe(
            currentStartDate =>{
                this.currentStartDate=currentStartDate;
                }
        );

        //get end date
        this.subscription = this.selectedEndDate$.subscribe(
            currentEndDate =>{
                this.currentEndDate=currentEndDate;
                }
        );

        if(this.currentRange == 'valid'){
            //we can go ahed calculating the query
            var filterOnDate;
            var toReturn;

            var startingDefaultDate = new Date("1826-01-01");
            var endingDefaultDate = new Date("1926-12-31");

            //to understand if there's the need to filter on the date
            if((this.currentStartDate - startingDefaultDate == 0)  && (this.currentEndDate - endingDefaultDate == 0) ) filterOnDate = false; //dammi la query completa senza filtraggio ulteriore
            else filterOnDate = true;

            //in this.fullLocations there's a list with the WHOLE location (empty query) 
            if(this.fullLocations == null) { 
                this.loadFullQuery(); 
            }

            //to clean the colored records in the table (if there are)
            this.recordsToHighlight.next(0);


            //Filtering the query according to the criteria and return the corresponding locations to draw
            if(this.currentStreetName == 'none' && this.currentName == 'none' ){
                toReturn = this.fullLocations;
            }
            else if(this.currentStreetName == 'none'){
                //the spatial criteria is empty, but not the surname criteria 
                var filteredLocations = this.fullLocations.filter(loc => loc.surnames === this.currentName);
                
                this.selectedName.next(this.currentName);
                toReturn = filteredLocations;
            }
            else if(this.currentName == 'none'){
                //the surname criteria is not selected, but the spatial criteria is
                if(this.currentPlaceTable == "Streets") var filteredLocations = this.fullLocations.filter(loc => loc.address === this.currentStreetName);
                else if(this.currentPlaceTable == "County") var filteredLocations = this.fullLocations.filter(loc => loc.county === this.currentStreetName);
                else if(this.currentPlaceTable == "Country") var filteredLocations = this.fullLocations.filter(loc => loc.country === this.currentStreetName);
              

                this.selectedStreet.next(this.currentStreetName);
                toReturn = filteredLocations;
            }
            else{
                //spatial and surname criteria are selected
                var filteredLocations = this.fullLocations.filter(loc => loc.surnames === this.currentName);

                if(this.currentPlaceTable == "Streets") var filteredLocations = filteredLocations.filter(loc => loc.address === this.currentStreetName);
                else if(this.currentPlaceTable == "County") var filteredLocations = filteredLocations.filter(loc => loc.county === this.currentStreetName);
                else if(this.currentPlaceTable == "Country") var filteredLocations = filteredLocations.filter(loc => loc.country === this.currentStreetName);
                
                this.selectedStreet.next(this.currentStreetName);
                this.selectedName.next(this.currentName);
                toReturn = filteredLocations;
            }

            if(filterOnDate == false) return toReturn;
            else{
                //filtering depending on the date
                var filteredLocations = toReturn.filter(loc => loc.date >= this.currentStartDate && loc.date <= this.currentEndDate);
                return filteredLocations;
            }

        }
        else{
            console.log("MAPSERVICE the date range is invilad don't call anything ");
            var emptyArray:Array<Location> = [];
            return emptyArray;
        }

        
    } //calculateQuery CLOSED

    testReorderTable(event:MouseEvent){
            var locations_drawn = this.calculateQuery();

            var selectedMarkerList = locations_drawn.filter(loc => loc.longitude == event.latlng.lng && loc.latitude == event.latlng.lat);
            var numMarkers = selectedMarkerList.length;
        
            var allTheOthersMarker = locations_drawn.filter(loc => loc.longitude != event.latlng.lng && loc.latitude != event.latlng.lat);

            for(var i=0; i<allTheOthersMarker.length; i++){
                selectedMarkerList.push(allTheOthersMarker[i]);
            }

            this.recordsOnPointSource.next(selectedMarkerList);
            this.recordsToHighlight.next(numMarkers);
    } //testReorderTable CLOSED


////////////////DRAWING HELPING FUNCTION/////////


    drawMarkersfromArray(locations_todraw:Array<Location>):L.FeatureGroup<any>{
        var tempLayer = new L.FeatureGroup();
        var group;
        this.recordsOnPointSource.next(locations_todraw);

        for (var i=0; i<locations_todraw.length; i++) {
            var markerLocation = new L.LatLng(locations_todraw[i].latitude, locations_todraw[i].longitude);
            var marker = new L.Marker(markerLocation);

            var popupInfo;
            
            if(locations_todraw[i].address != "n/a" && locations_todraw[i].address != "" && locations_todraw[i].address != " ") popupInfo = locations_todraw[i].address;
            else if(locations_todraw[i].city != "n/a" && locations_todraw[i].city != "" && locations_todraw[i].address != " ") popupInfo = locations_todraw[i].city;
            else if(locations_todraw[i].county != "n/a" && locations_todraw[i].county != "" && locations_todraw[i].county != " ") popupInfo = locations_todraw[i].county;
            else if(locations_todraw[i].country != "n/a" && locations_todraw[i].country != "" && locations_todraw[i].country != " ") popupInfo = locations_todraw[i].country;

            marker.bindPopup(popupInfo);

            marker.on('click', (event: MouseEvent) => {
                this.testReorderTable(event);
                event.target.setIcon(this.highlightedIcon);
            });
            
            marker.on('popupclose', (event: MouseEvent) => {
                this.recordsToHighlight.next(0);
                event.target.setIcon(this.standardIcon);
            });

            group = tempLayer.addLayer(marker);
        }

        
        return tempLayer;
        //console.log(tempLayer);
    } //drawMarkersfromArray CLOSED

    drawClustersfromArray(myPoints:Array<Location>):void{
        var clusterPoints = [];
        var i = 0;
        var group;
        this.recordsOnPointSource.next(myPoints);

        myPoints.forEach(function(d) {
            var popupInfo;

            if(d.address != "n/a" && d.address != "" && d.address != " ") popupInfo = d.address;
            else if(d.city != "n/a" && d.city != "" && d.city != " ") popupInfo = d.city;
            else if(d.county != "n/a" && d.county != "" && d.county != " ") popupInfo = d.county;
            else if(d.country != "n/a" && d.country != "" && d.country != " ") popupInfo = d.country;

            var test = [d.latitude, d.longitude, popupInfo]; 
            clusterPoints[i] = test;
            i++;
        });

        this.clusterLayer = L.markerClusterGroup();

        for (var i = 0; i < clusterPoints.length; i++) {
            var a = clusterPoints[i];
            var marker = L.marker(new L.LatLng(a[0], a[1]));
            marker.bindPopup(a[2]); //is not always the same, depends on the information we have on the relative marker

            marker.on('click', (event: MouseEvent) => {
                this.testReorderTable(event);
                event.target.setIcon(this.highlightedIcon);
            });

            marker.on('popupclose', (event: MouseEvent) => {
                this.recordsToHighlight.next(0);
                event.target.setIcon(this.standardIcon);
            });
            
            group = this.clusterLayer.addLayer(marker);
        }

        console.log(group);

        this.map.addLayer(this.clusterLayer);
		console.log(this.map);
        //calculate the boundaries and setting the zoom according to the number of results
        if(clusterPoints.length != 0) this.map.fitBounds(group.getBounds(), {maxZoom:15});
		
        else this.map.setView([53.34204355,-6.26736170056302], 12);
		
    } //drawClustersFromArray CLOSED

    drawHeatMapfromArray(myPoints:Array<Location>):void{
        var coordinates = [];
        var i = 0;

        myPoints.forEach(function(d) {
            coordinates[i] = [d.latitude, d.longitude];
            i++;
        }
        
        

        this.heatLayer = L.heatLayer(coordinates, {max: myPoints.length; minOpacity: 0.43; radius: 22}).addTo(this.map);

        //calculate the boundaries and setting the zoom according to the number of results
        if(myPoints.length != 0){
                this.map.fitBounds(new L.LatLngBounds(coordinates), {maxZoom:15});
            } 
        else this.map.setView([53.34204355,-6.26736170056302], 14);
    } //drawMapFromArray CLOSED

    //NOT USED RIGHT NOW BECAUSE IT IS INCOMPLETE
    updateSliderAreaControl(): void{
        //this function should select the date range in the slider component, according to the data range selected in the textual component
        //right now it recalculate the axis according to it, but doesn't select the rectangle in the slider that rapresents that range
        let range: Date[] = [];
        range[0] = self.currentStartDate;
        range[1] = self.currentEndDate;

        var dominio = self.subXScale.domain();

        var parseDate = d3.time.format("%m %Y").parse;
        var startRangeFormattedDate = parseDate((range[0].getMonth() + 1) + " " + range[0].getFullYear());
        var endRangeFormattedDate = parseDate((range[1].getMonth() + 1) + " " + range[1].getFullYear());
        
        if((startRangeFormattedDate - dominio[0] == 0) && (endRangeFormattedDate - dominio[1] == 0)){
            console.log("they are the same");
        }
        else{
            console.log("they are different");

            var str = "Number of visits per month between " + range[0].getDate() + "-" + (range[0].getMonth()+1) + "-" + range[0].getFullYear() + " and " + range[1].getDate() + "-" + (range[1].getMonth()+1) + "-" + range[1].getFullYear();
            d3.select('#infoSpan').html(str);
            
            this.mainXScale.domain([range[0],range[1]]);
            this.mainYScale.domain([0, self.recalculateYAxisMaximum(range, this.d3Datum)]);

            
            self.main.select('.area').attr('d', self.mainArea);
            self.main.select('.x.axis').transition().call(self.mainXAxis);
            self.main.select('.y.axis').transition().call(self.mainYAxis);

            //self.sub.select('rect.extent').transition().attr('width', 300);
            //the rect should represents the data range
        }

    }
   
    showSLider(): void{
        //this function is called just when the user CHECK the box, not when he's UNCHECKING it
        if (this.flagToDrawSlider == 0) {
            this.drawSlider();
            this.flagToDrawSlider = 1;
        }

        //this.updateSliderAreaControl(); NOT CALLED BECAUSE IT IS NOT COMPLETE YET
    } //showSlider CLOSED

    drawSlider():void{
    this.calculateD3Date();

        var W = 800, H = 500;

        //Setting up Margins
        var mainMargin = {top: 10, right: 10, left: 30, bottom: 140};
        var subMargin = {top: 400, right: 10, bottom: 40, left: 30};

        //Widths, Heights
        var width = W - mainMargin.left - mainMargin.right;
        var mainHeight = H - mainMargin.top - mainMargin.bottom;
        var subHeight = H - subMargin.top - subMargin.bottom;

        //Date Parser
        var parseDate = d3.time.format("%b %Y").parse;

        //Main Chart Scales
        this.mainXScale = d3.time.scale().range([0, width]);
        this.mainYScale = d3.scale.linear().range([mainHeight, 0]);
       
        //Sub Chart scales
        this.subXScale = d3.time.scale().range([0, width]);
        var subYScale = d3.scale.linear().range([subHeight, 0]);

        //Main Chart Axes
        this.mainXAxis = d3.svg.axis().scale(this.mainXScale).orient('bottom');
        this.mainYAxis = d3.svg.axis().scale(this.mainYScale).orient('left');

        //Sub Chart Axes
        var subXAxis = d3.svg.axis().scale(this.subXScale).orient('bottom');
        var subYAxis = d3.svg.axis().scale(subYScale).orient('left').ticks(2);

        //Area
        this.mainArea = d3.svg.area()
            .interpolate('monotone')
            .x(function (d) {
                return self.mainXScale(d.date)
            })
            .y0(mainHeight)
            .y1(function (d) {
                return self.mainYScale(d.numberOfReaders)
            });

        

        var subArea = d3.svg.area()
            .interpolate('monotone')
            .x(function (d) {
                return self.subXScale(d.date)
            })
            .y0(subHeight)
            .y1(function (d) {
                return subYScale(d.numberOfReaders)
            });

        var svg = d3.select('#sliderBody').append('svg')
            .attr('width', W)
            .attr('height', H);



        svg.append('defs')
            .append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width)
            .attr('height', mainHeight);


        this.main = svg.append('g')
            .classed('main', true)
            .attr("transform", "translate(" + mainMargin.left + "," + 100 + ")");


        this.sub = svg.append('g')
            .classed('sub', true)
            .attr("transform", "translate(" + subMargin.left + "," + mainMargin.top + ")");
        
        var brush = d3.svg.brush()
            .x(self.subXScale)
            .on("brush", brushed);

        
        this.mainXScale.domain(d3.extent(this.d3Datum, function (d) {
            return d.date
        }));

        this.mainYScale.domain([0, d3.max(this.d3Datum, function (d) {
            return d.numberOfReaders
        })]);

        this.subXScale.domain(this.mainXScale.domain());
        subYScale.domain(this.mainYScale.domain());
        
        this.sub.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0, " + subHeight + ")")
            .call(subXAxis);

        this.sub.append("g")
            .classed("y axis", true)
            .attr("transform", "translate(0, 0)")
            .call(subYAxis);

        this.sub.append('path')
            .datum(self.d3Datum)
            .classed('area', true)
            .attr('d', subArea);

        this.sub.append("g")
            .classed("x brush", true)
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", subHeight + 7);


        this.main.append("g")
            .classed("x axis", true)
            .attr("transform", "translate(0, " + mainHeight + ")")
            .call(self.mainXAxis);

        this.main.append("g")
            .classed("y axis", true)
            .attr("transform", "translate(0, 0)")
            .call(self.mainYAxis);           

        this.main.append('path')
            .datum(self.d3Datum)
            .classed('area', true)
            .attr('d', self.mainArea);
    
        d3.select('#reset').on('click', function () {
            self.mainXScale.domain(self.subXScale.domain());
            self.mainYScale.domain(subYScale.domain());
            self.main.select('.area').transition().attr('d', self.mainArea);
            self.main.select('.x.axis').transition().call(self.mainXAxis);
            self.main.select('.y.axis').transition().call(self.mainYAxis);
            self.sub.select('rect.extent').transition().attr('width', 0);
            self.sliderRangeChanged(self.mainXScale.domain());
        });

        //brush function (called everytime that there's an interaction with the time slider)
        function brushed() {
            self.mainXScale.domain(brush.empty() ? self.subXScale.domain() : brush.extent());
            self.mainYScale.domain(brush.empty() ? subYScale.domain() : [0, self.recalculateYAxisMaximum(brush.extent(), self.d3Datum)]);
            self.main.select('.area').attr('d', self.mainArea);
            self.main.select('.x.axis').transition().call(self.mainXAxis);
            self.main.select('.y.axis').transition().call(self.mainYAxis);
            self.sliderRangeChanged(self.mainXScale.domain());
        }
        
    } //drawSlider CLOSED

    recalculateYAxisMaximum(array: Array <Date>, dati: Array<DateNumberReaders>): Number {
        var maxi = 0;
        var toReturn = dati.filter(el => el.date >= array[0] && el.date <= array[1]);

        toReturn.forEach (function (d) {
            if(d.numberOfReaders > maxi) maxi = d.numberOfReaders;
        });

        return maxi;
    }

    sliderRangeChanged(sliderRange: Array <Date>){
        var str ="";
        var beginJsDate = sliderRange[0];
        var endJsDate = sliderRange[1];

        str = "Number of visits per month between " + beginJsDate.getDate() + "-" + (beginJsDate.getMonth()+1) + "-" + beginJsDate.getFullYear() + " and " + endJsDate.getDate() + "-" + (endJsDate.getMonth()+1) + "-" + endJsDate.getFullYear();
        d3.select('#infoSpan').html(str);
        
        this.selectedStartDate.next(beginJsDate);
        this.selectedEndDate.next(endJsDate);
                
        this.selectedRange.next('valid');
        this.selectedRangeFormatted.next(beginJsDate.getDate() + "-" + (beginJsDate.getMonth()+1) + "-" + beginJsDate.getFullYear() + " - " +  endJsDate.getDate() + "-" + (endJsDate.getMonth()+1) + "-" + endJsDate.getFullYear() + " (valid)");
                
        this.searchCriteriaChanged();
    } //sliderRangeChanged CLOSED

////////////////////////////////LOGIC FUNCTIONs//////////////////////////////////////////////////////////
    
    //called every time that a checkbox is clicked
    updateBoxList(clickedIndex: int):void {
        var previousIndex;
        var query;

        for (var i=0; i< this.boxesList.length; i++){
            if (this.boxesList[i].checked == true) {
                previousIndex = this.boxesList[i].id;
                break;
            }
            else previousIndex = -1;
        }

        query = this.calculateQuery();
        
        if (previousIndex == -1){
            previousIndex = clickedIndex;
            this[this.boxesList[clickedIndex].showFunctionName](query);
            this.boxesList[clickedIndex].checked = true;
            
        }
        else{
            if(clickedIndex == previousIndex){
                this.boxesList[clickedIndex].checked = false;
                previousIndex = -1;
                this[this.boxesList[clickedIndex].hideFunctionName]();
                
            }
            else{
                this.boxesList[previousIndex].checked = false;
                this[this.boxesList[previousIndex].hideFunctionName]();
                this[this.boxesList[clickedIndex].showFunctionName](query);
                this.boxesList[clickedIndex].checked = true;
                previousIndex = clickedIndex;
                
            }
        }
    } //updateBoxList CLOSED

    //called every time that a criteria changes
    searchCriteriaChanged():void{
        var query;
       
        query = this.calculateQuery();
        
        var somethingSelected;

        for (var i=0; i< this.boxesList.length; i++){
            if (this.boxesList[i].checked == true) {
                somethingSelected = this.boxesList[i].id;
                break;
            }
            else somethingSelected = -1;
        }

        if(somethingSelected == -1) {
            //console.log("FIRST INTERACTION WITH THE SEARCH BAR ");
            this.showMarkers(query);
            this.boxesList[0].checked = true;
        }
        else{
            this[this.boxesList[somethingSelected].showFunctionName](query);
        }
    } //seaarchCriteriaChanged CLOSED

//////////////////////////////////DRAWING AND HIDING FUNCTIONs////////////////////////////////////////////

    showMarkers(locations_todraw: Array<Location>): void{
        if(this.map.hasLayer(this.markersLayer)) this.map.removeLayer(this.markersLayer);

        this.numberOfResults.next(locations_todraw.length);
        this.markersLayer = this.drawMarkersfromArray(locations_todraw);

        //console.log(this.markersLayer.getBounds());
        this.markersLayer.addTo(this.map);
        //calculate the boundaries and setting the zoom according to the number of results
        if(locations_todraw.length != 0) this.map.fitBounds(this.markersLayer.getBounds(), {maxZoom:15});
        else this.map.setView([53.34204355,-6.26736170056302], 13);

        this.areDetailsShowed.next(true);
    } //showMarkers CLOSED

    hideMarkers(): void{
        this.map.removeLayer(this.markersLayer);
        this.areDetailsShowed.next(false);
    } //hideMarkers CLOSED

    showClusteringPoints(locations_todraw: Array<Location>): void{
        if(this.map.hasLayer(this.clusterLayer)) this.map.removeLayer(this.clusterLayer);

        this.numberOfResults.next(locations_todraw.length);
        this.drawClustersfromArray(locations_todraw);

        this.areDetailsShowed.next(true);
    } //showClustering CLOSED

    hideClusteringPoints(): void{
        this.map.removeLayer(this.clusterLayer);
        this.areDetailsShowed.next(false);
    } //hideClustering CLOSED

    showHeatMap(locations_todraw: Array<Location>):void{
        if(this.map.hasLayer(this.heatLayer)) this.map.removeLayer(this.heatLayer);
        
        this.drawHeatMapfromArray(locations_todraw);
    } //showHeatMap CLOSED

    hideHeatMap():void{
        this.map.removeLayer(this.heatLayer);
    } //hideHeatMap CLOSED
        
}//export class CLOSED