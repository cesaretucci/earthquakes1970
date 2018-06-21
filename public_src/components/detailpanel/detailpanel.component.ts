import {Component, Directive  } from '@angular/core';
import { MapService} from '../../services/map.service';
import {ReadJsonService} from "../../services/readjson.service";
import { Subscription }   from 'rxjs/Subscription';
import { ModalComponent } from '../../components/modal/modal.component';

var jQuery = require ("jquery");



@Component({
    selector: 'detail-panel',
    template: require<any>('./detailpanel.component.html'),
    styles: [require<any>('./detailpanel.component.less')],
    providers:[]
})
export class DetailPanelComponent {

    public resultNumberstring = '';

    public active = false;
    public contents='';
    subscription: Subscription;
    public records;
    public streetName='';
    public placeTableSelected='';
    public readerName='';
    public rangeFormatted='';
    public resultsNumber;
    public recordsToHighlight;
    public modal: ModalComponent;
    selectedIndex : Array<Number> = [];
    openModalWindow:boolean=false;
    imagePointer:number;     

    private readerInfo: any;
	
	//CESARE's VARIABLES
	private tempModalHeader='';
	private tempModalBody='';
	

    //this constructor is connected with the map service using the observables
    constructor(private mapService: MapService, readJson:ReadJsonService){
        this.readingJson = readJson;

        this.subscription = mapService.contentInTable$.subscribe(
            contents => {
                this.contents=contents; //latlng object
            }
        );

        this.subscription = mapService.recordsOnPoint$.subscribe(
            records =>{
                    this.records=records;
                    this.updateReadersInfo();
            }
        );

        this.subscription = mapService.areDetailsShowed$.subscribe(
            active =>{
                    this.active=active;
                }
        );

        this.subscription = mapService.selectedStreet$.subscribe(
            streetName =>{
                this.streetName=streetName;
                }
        );

        this.subscription = mapService.selectedName$.subscribe(
            readerName =>{
                this.readerName=readerName;
                }
        );

        this.subscription = mapService.numberOfResults$.subscribe(
            resultsNumber =>{
                this.resultsNumber = resultsNumber;
                
            }
        );

        this.subscription = mapService.recordsToHighlight$.subscribe(
            recordsToHighlight =>{
                this.recordsToHighlight = recordsToHighlight;
                this.selectedIndex = [];
                this.colorRecords();
            }
        );

        this.subscription = mapService.selectedPlaceTable$.subscribe(
            placeTableSelected =>{
                this.placeTableSelected=placeTableSelected;
                }
        );

        this.subscription = mapService.selectedRangeFormatted$.subscribe(
            rangeFormatted =>{
                this.rangeFormatted=rangeFormatted;
                }
        );
    }

    ngAfterViewInit() {
        this.readingJson.getReadersInfo()
            .subscribe(features => { //console.log("consol feats " +  features);
                this.readerInfo = features;          
            },error=> console.log(error));
    } 

    colorRecords():void{
        for(var i=0; i<this.recordsToHighlight; i++) {
            this.selectedIndex[i] = i;
        }
    }

    updateReadersInfo():void{
        let testArray: Array<Object> = [];

        if(this.records.length != 0) {

            var i=0;
            do{
                var readerID = this.records[i].reader_id;


                for(var j=0; j<this.readerInfo.length; j++){

                    if(readerID == this.readerInfo[j].id){

                        var testObj = this.records[i];
                        testObj.gender = this.readerInfo[j].gender;

                        testObj.title_prefix = this.readerInfo[j].title_prefix;
                        testObj.suffix = this.readerInfo[j].suffix;
                        testObj.postnominal_title = this.readerInfo[j].postnominal_title;
                        testObj.gender = this.readerInfo[j].gender;
                        testObj.occupation = this.readerInfo[j].occupation;
                        testObj.notes = this.readerInfo[j].notes;
                        testObj.referee = this.readerInfo[j].referee;
                        testObj.visits_ids = this.readerInfo[j].visits_ids;
                       // testObj.readabledate = this.readerInfo[j].readabledate;
                        testArray.push(testObj);
                    }
                }
                i++;
            }while(i<this.records.length);

            //console.log(testArray);
            this.records = testArray;
            this.resultNumberstring = 'Results: ' + this.records.length + ' readers' ;
        }
    }

    //NOT USED AT THE MOMENT
    updateReadersNumber():void{
        let testArray : Array<Object> = [];
        var flag = 0;

        for(var i=0; i<this.records.length; i++){
            flag = 0;
            var readerID = this.records[i].reader_id;

            for(var j=0; j<testArray.length; j++){
                if(readerID == testArray[j].reader_id){
                    flag = 1;
                    //console.log(readerID);
                }
            }

            if(flag != 1) testArray.push(this.records[i]);
        }

        console.log(testArray);

        this.records = testArray;
        this.resultNumberstring = 'Results: ' + this.records.length + ' readers' ;
    }
      
    showPopUp(selectedRecord,mymodal): void{

        console.log(selectedRecord);
   
        var nameString = "";
        if (selectedRecord.title_prefix != "" && selectedRecord.title_prefix != " ") nameString = nameString + selectedRecord.title_prefix + " ";
        nameString = nameString + selectedRecord.forenames + " " + selectedRecord.surnames + " ";
        if (selectedRecord.suffix != "" && selectedRecord.suffix != " ") nameString = nameString + selectedRecord.suffix;

        var addressString = "";
        if (selectedRecord.housenumber != "n/a" && selectedRecord.housenumber != "" && selectedRecord.housenumber != " "  && (!isNaN(selectedRecord.housenumber)) ) addressString = addressString + selectedRecord.housenumber + ", ";
        if (selectedRecord.address != "n/a" && selectedRecord.address != "" && selectedRecord.address != " ") addressString = addressString + selectedRecord.address + ", ";
        if (selectedRecord.city != "n/a" && selectedRecord.city != "" && selectedRecord.city != " ") addressString = addressString + selectedRecord.city + ", ";
        if (selectedRecord.county != "n/a" && selectedRecord.county != "" && selectedRecord.county != " ") addressString = addressString + selectedRecord.county + ", ";
        if (selectedRecord.country != "n/a" && selectedRecord.country != "" && selectedRecord.country != " ") addressString = addressString + selectedRecord.country ;

        var postNomilanString = "";
        if (selectedRecord.postnominal_title != "n/a" && selectedRecord.postnominal_title != "" && selectedRecord.postnominal_title != " " && selectedRecord.postnominal_title != null) postNomilanString = selectedRecord.postnominal_title;
        else postNomilanString = "n/a";

        var genderString = "";
        if (selectedRecord.gender != "n/a" && selectedRecord.gender != "" && selectedRecord.gender != " " && selectedRecord.gender != null) {
            if(selectedRecord.gender == "m") genderString = "Male";
            else genderString = "Female";
        }
        else genderString = "n/a";

        var occupationString = "";
        if (selectedRecord.occupation != "n/a" && selectedRecord.occupation != "" && selectedRecord.occupation != " " && selectedRecord.occupation != null) occupationString = selectedRecord.occupation;
        else occupationString = "n/a";

        var notesString = "";
        if (selectedRecord.notes != "n/a" && selectedRecord.notes != "" && selectedRecord.notes != " " && selectedRecord.notes != null) notesString = selectedRecord.notes;
        else notesString = "n/a";

        var refereeMainString = "";

        
        var referee_manual_id;
        var referee_title_prefix;
        var referee_forenames;
        var referee_surnames;
        var referee_suffix;
        var referee_postnominal_title;
        var referee_notes;

        var subRefereeStr;
        

        if (selectedRecord.referee != "n/a" && selectedRecord.referee != "" && selectedRecord.referee != " " && selectedRecord.referee != null) {

            var refereeArray = selectedRecord.referee[0];
            //console.log(refereeArray);
            //console.log(refereeArray.manual_id);

            referee_manual_id = refereeArray.manual_id;
            referee_title_prefix = refereeArray.title_prefix;
            referee_forenames = refereeArray.forenames;
            referee_surnames = refereeArray.surnames;
            referee_suffix = refereeArray.suffix;
            referee_postnominal_title = refereeArray.postnominal_title;
            referee_notes = refereeArray.notes;
            
            if (referee_title_prefix != "" && referee_title_prefix != " " && referee_title_prefix != null && referee_title_prefix != "n/a") refereeMainString = refereeMainString + referee_title_prefix + " ";
            if (referee_forenames != "" && referee_forenames != " " && referee_forenames != null && referee_forenames != "n/a") refereeMainString = refereeMainString + referee_forenames + " ";
            if (referee_surnames != "" && referee_surnames != " " && referee_surnames != null && referee_surnames != "n/a") refereeMainString = refereeMainString + referee_surnames + " ";
            if (referee_suffix != "" && referee_suffix != " " && referee_suffix != null && referee_suffix != "n/a") refereeMainString = refereeMainString + referee_suffix;

            if (referee_postnominal_title != "n/a" && referee_postnominal_title != "" && referee_postnominal_title != " " && referee_postnominal_title != null) referee_postnominal_title = referee_postnominal_title;
            else referee_postnominal_title = "no referee post-nominal letter available";

            if (referee_notes != "n/a" && referee_notes != "" && referee_notes != " " && referee_notes != null) referee_notes = referee_notes;
            else referee_notes = "n/a";
            
            subRefereeStr = 
                    "<ul>" +
                        "<li>" + "<b> <i> Post-nominal letter : </i> </b> " + referee_postnominal_title + "</li>" +
                        "<li>" + "<b> <i> Notes : </i> </b> " + referee_notes + "</li>" +
                    "</ul>";
        }
        else {
            refereeMainString = "n/a";
            subRefereeStr = "";
        }


        //calculating the stirng for the visits info section
        //the buttons need to be calculated according to how many visits there are
        
        var imageDivStr = "";
        
        var imageSourcePath="../own/images/resized/";
        var thumbSourcePath="../own/images/thumbnails/";
        //read the images associated to the record

        var images_names:Array<Object>=[];    //this may be pre-processed after the initial load
        var image_path = "";
        var image_extension = ".jpeg"
        selectedRecord.recordpics.forEach(picname => {
            var imageInfo = new Object();

            imageInfo.thumb=thumbSourcePath + picname +"_thumb"+ image_extension;
            imageInfo.img=imageSourcePath + picname+"_resized" + image_extension;
            imageInfo.desc = picname + image_extension;
            images_names.push(imageInfo);
            console.log(picname);
            
        });
		
		console.log("images_names:");
        console.log(images_names);


        // load the image (THERE SOULD BE JUST ONE PER EVERY POPUP because it represents the concept of the visit)
      /*  imageDivStr = "<div id='previewDiv'>"+
            "<img id='imgpreview' alt='Img"+selectedRecord.visits_ids[0]+"' src='https://library.osu.edu/projects/bellingham-manuscript/read/manuscriptJPGs_1200px_wide/BellinghamCB092.jpg' style='width:100%'>"+
            "</div>";
	*/
		
        imageDivStr = `<div id='previewDiv' style='margin-top:15px'>`;
		
		
	//CESARE's CODE
		
		
		
		images_names.forEach(pic =>{			
			console.log(pic);
			imageDivStr +="<div style='display:inline; margin: 5px'> <img class='list-img' style='width:94.5px; height:142px; border:solid 3px white;' src='" + pic.img + "' alt='"+pic.desc+"'/></div>";
        });		
		
		
	//CESARE's CODE END	
		
		
		//ORIGINAL CODE
			
		
     
			imageDivStr = imageDivStr + " </div>";
	 /*  		
			images_names.forEach(pic =>{
            imageDivStr = imageDivStr + " <div class='float-left'> ";
            imageDivStr = imageDivStr + "<img class='list-img' src='" + pic.thumb + "' (click)='OpenImageModel(pic.img, images_names)' alt=pic.desc />";
            imageDivStr = imageDivStr + " </div>";

        });

        imageDivStr = imageDivStr + "</div>";
        imageDivStr = imageDivStr + "<div *ngIf='openModalWindow'>"+
                        "<ImageModal [modalImages]='images_names' [imagePointer] = 'imagePointer'"+
                        " (cancelEvent) ='cancelImageModel()'></ImageModal></div>";
        
 */ //ORIGINAL CODE END
 
        console.log(imageDivStr);

        var visitsString = "";
        var multipleVisits ="";

        if (selectedRecord.visits_ids.length == 1)  {
            //visitsString = selectedRecord.date;

        }
        else{
            //visitsString = visitsString + selectedRecord.date + ", "
            multipleVisits = "<li> <b> Other visit(s) date: </b>";

            for (var i=1; i<selectedRecord.visits_ids.length; i++){
                var visitId = selectedRecord.visits_ids[i];

                for(var i=0; i<this.records.length; i++){
                    if(visitId == this.records[i].recordnumber){
                        var formattedDate = this.records[i].date.getDate() + "-" + (this.records[i].date.getMonth()+1) + "-"+ this.records[i].date.getFullYear();
                        //var formattedDate = this.records[i].readabledate;
                        multipleVisits = multipleVisits + formattedDate + "  ";
                    }
                }
            
            }
            multipleVisits = multipleVisits + "</li>";
        }

        var formattedFirstDate = selectedRecord.date.getDate() + "-" + (selectedRecord.date.getMonth()+1) + "-" + selectedRecord.date.getFullYear();
       // var formattedFirstDate = selectedRecord.readabledate;
	   
        /*ORIGINAL CODE
        jQuery(".app-modal-header").html("<h2>" + nameString + "</h2>");

        jQuery(".app-modal-body").html(
            "<h3> Personal information </h3>" + 
            "<ul>" +
                "<li>" + " <b> Address: </b> " + addressString +  "</li>" +
                "<li>" + " <b> Post-nominal letter: </b> " + postNomilanString +  "</li>" +
                "<li>" + " <b> Gender: </b> " + genderString +  "</li>" +
                "<li>" + " <b> Occupation: </b> " + occupationString +library"</li>" +
                "<li>" + " <b> Notes: </b> " + notesString +  "</li>" +
                "<li>" + " <b> Referee: </b> " + refereeMainString + 
                    subRefereeStr +
                "</li>" +
            "</ul>" +
            "<h3> Visits information </h3>" +
            "<ul>" +
            "<li>" + "<b> Visit date: </b>" + formattedFirstDate + "</li>" + 
            "<li>" + "<b> Total visit(s): </b> " + selectedRecord.visits_ids.length + "</li>" +
                multipleVisits+
            "</ul>" +
            imageDivStr
        );

		 ORIGINAL CODE END */
		 
		 //CESARE's CODE
		 
		 this.tempModalHeader="<h2>" + nameString + "</h2>";
		 this.tempModalBody="<h3> Personal information </h3>" + 
            "<ul>" +
                "<li>" + " <b> Address: </b> " + addressString +  "</li>" +
                "<li>" + " <b> Post-nominal letter: </b> " + postNomilanString +  "</li>" +
                "<li>" + " <b> Gender: </b> " + genderString +  "</li>" +
                "<li>" + " <b> Occupation: </b> " + occupationString +  "</li>" +
                "<li>" + " <b> Notes: </b> " + notesString +  "</li>" +
                "<li>" + " <b> Referee: </b> " + refereeMainString + 
                    subRefereeStr +
                "</li>" +
            "</ul>" +
            "<h3> Visits information </h3>" +
            "<ul>" +
            "<li>" + "<b> Visit date: </b>" + formattedFirstDate + "</li>" + 
            "<li>" + "<b> Total visit(s): </b> " + selectedRecord.visits_ids.length + "</li>" +
                multipleVisits+
            "</ul><br>" +
			"<h3>Visits' photo references</h3><b style='font-size:12px'>Clilck to open the full size image</b>"+imageDivStr;
			
		this.backToModal();
			
		 
		 
		 
		 //CESARE's CODE END
        
        mymodal.show(); 

        /*
        for (var i=0; i<selectedRecord.visits_ids.length; i++){
                
                jQuery("#button"+selectedRecord.visits_ids[i]).click(function (){

                    jQuery('#previewDiv').html("<img id='imgpreview' alt='img"+selectedRecord.visits_ids[i]+"' src='https://s-media-cache-ak0.pinimg.com/originals/69/2c/75/692c7500f67e8dcdb6e9b001db33dfa9.jpg' style='width:100%'>");

                      jQuery("button").each(function() {
                      if (jQuery(this).hasClass('active')) 
                      {
                          jQuery(this).removeClass('active');
                      }
                      });
                      jQuery(this).addClass('active'); 

                });
                
        }
        */
 
       
    } 
	
	//CESARE'S
	
	
	backToModal():void{
		console.log("backToModal function was called \n");
		var self=this;
		jQuery(".app-modal-header").html(this.tempModalHeader);
		jQuery(".app-modal-body").html(this.tempModalBody);
		jQuery(".list-img").on(
			{mouseleave: function(){
					jQuery(this).css({
						"border":"solid 3px white";
						"cursor":"auto";
						"background-color":"white";
					});
				}
			,
			mouseenter: function(){
					jQuery(this).css({
						"border":"solid 3px #337ab7";
						"cursor":"pointer";
						"background-color":"#337ab7";
					});
				}
			}			
		);
		jQuery(".list-img").click(function(){
			var source=jQuery(this).attr("src");		
			//this 2 lines convert path from relative to absolute
		//	source=source.replace('..','http://localhost:8080');
		//	source=source.replace(/\s+/g, '%');		
			console.log("source in jquery: "+source);
			var descr=jQuery(this).attr("alt");
			jQuery(".app-modal-header").html("<div><span id='backButton'><img src='../own/images/backicon.png' style='width:30px; height:30px; margin:auto;'/></span><h2 style='float:left; margin-left:20px;'>"+descr+"<h2></div>");
			jQuery(".app-modal-body").html("<img src='"+source+"' style='width:100%' alt='no pic like that'/><br>");
			jQuery("#backButton").click(function(){self.backToModal();});
			jQuery("#backButton").css({
				"float": "left";
				"border":"solid 2px lightgray",
				"border-radius":"7px";
				"background-color":"#D8D8D8";
				"padding":"5px";
				"margin":"5px";
				"display":"inline";
			});
			jQuery("#backButton").on({
				mouseenter: function(){
					jQuery("#backButton").css({
						"cursor":"pointer";
						"background-color":"#E9E9E9";
					});}, 
				mouseleave: function(){
					jQuery("#backButton").css({
						"cursor":"auto";
						"background-color":"#D8D8D8";
					});
				}
			});				
		});	
	}
	//CESARE'S END
	
/*
ORIGINAL CODE

    OpenImageModel(imageSrc,images):void {

        console.log(images);
        //alert('OpenImages');
        var imageModalPointer;
        for (var i = 0; i < images.length; i++) {
               if (imageSrc === images[i].img) {
                 imageModalPointer = i;
                 console.log('jhhl',i);
                 break;
               }
          }
        this.openModalWindow = true;
        //this.images = images;
        this.imagePointer  = imageModalPointer;
      }
      cancelImageModel() {
        this.openModalWindow = false;
      }
	  
	  ORIGINAL CODE END
*/

    getReadableDate(thisDate):string{
        var newDate = thisDate.getDate() + "/" + (thisDate.getMonth()+1) + "/" + thisDate.getFullYear();
        return newDate;
    }


    toggleActive() {
        if(this.active) {
            this.active = false;
        } else {
            this.active = true;
        }
    }

}