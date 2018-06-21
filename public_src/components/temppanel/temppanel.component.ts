import {Component} from '@angular/core';
import {MapService} from '../../services/map.service';
import {Subscription} from 'rxjs/Subscription';
import {IMyDrpOptions, IMyDateRangeModel, IMyCalendarViewChanged } from 'mydaterangepicker';

@Component({
    selector: 'temporal-panel',
    template: require<any>('./temppanel.component.html'),
    styles: [require<any>('./temppanel.component.less')],
    providers:[]
})

export class TempPanelComponent {
    subscription: Subscription;
    public actutalStartDate = '';
    public actualEndDate = '';

    private mapService: MapService;
    private isValid = true; //observable per mostrare il paragrafo che suggerisce di inserire un range corretto
    private isSliderBoxChecked = false; //attributo sulla proprietà checked della checkbox che mostra lo slider 
    private flag = 0;

    // Initialized to specific date range (01.01.1928).
    private model: Object = {
            beginDate: {year: 1826, month: 1, day: 1},
            endDate: {year: 1926, month: 12, day: 31}
    };

    private myDateRangePickerOptions: IMyDpOptions = {
        // other options...
        ariaLabelInputField: '',
        componentDisabled: false,
        width: '100%',
        showApplyBtn: false,
        showTodayBtn: false,
        showClearDateRangeBtn: false,
        dateFormat: 'dd-mm-yyyy',
        disableUntil: {year: 1825, month: 12, day: 30},
        disableSince: {year: 1927, month: 1, day: 1}
    };

    constructor(mapService: MapService) { 
        this.mapService=mapService;

        
        this.subscription = this.mapService.selectedStartDate$.subscribe(
            actutalStartDate =>{
                this.actutalStartDate=actutalStartDate;
                }
        );

        this.subscription = this.mapService.selectedEndDate$.subscribe(
            actualEndDate =>{
                this.actualEndDate=actualEndDate;
                }
        );
        

    };

    public ngOnInit():void{
        this.mapService.selectedStartDate.next(new Date("1826-01-01"));
        this.mapService.selectedEndDate.next(new Date("1926-12-31"));
    }

    public ngAfterViewInit():void {
        this.mapService.selectedRange.next('valid');
        this.isValid = true;
        //this.mapService.updateSliderAreaControl();
    }

    //data-range bar selector
    public onDateRangeChanged(event: IMyDateRangeModel) {
        this.mapService.selectedStartDate.next(event.beginJsDate);
        this.mapService.selectedEndDate.next(event.endJsDate);
        
        this.mapService.selectedRange.next('valid');
        this.isValid = true;
        
        this.mapService.searchCriteriaChanged();
    }

    //data-range bar selector
    public onInputFieldChanged(event: IMyCalendarViewChanged) {

        if(event.valid == true){
            this.mapService.selectedRange.next('valid');
            this.isValid = true;
            this.mapService.selectedRangeFormatted.next(event.value + " (valid)");
        }
        else{
            this.mapService.selectedRange.next('invalid');
            this.isValid = false;
            this.mapService.selectedRangeFormatted.next(event.value + " (invalid)");
            }
    }

    //button to reset the original time range
    public resetTimeRange():void{
        //update the input field
        this.model = {
            beginDate: {year: 1826, month: 1, day: 1},
            endDate: {year: 1926, month: 12, day: 31}
        };

        //update the obserable that the service use to calculate the query
        this.mapService.selectedStartDate.next(new Date("1826-01-01"));
        this.mapService.selectedEndDate.next(new Date("1926-12-31"));
        //parameter that mapService.calculateQuery() uses to understand if there's need to filter on time or not
        this.mapService.selectedRange.next('valid');
        //parameter to show the paragraph that suggest you to select a valid data range
        this.isValid = true;
        this.mapService.searchCriteriaChanged();
    }

    //checkbox to show the timeline slider selector
    public showTimeline(): void{

        if(this.flag == 0) {
            this.flag = 1;
            this.mapService.calculateReadersPerYear();
        }
        
        if(this.isSliderBoxChecked==false){
            //showing the slider div
            let copy = this.getCopyOfOptions();
            copy.componentDisabled = true;
            this.myDateRangePickerOptions = copy;
            

            this.isSliderBoxChecked = true;
            this.mapService.isSliderShowed.next(true);
            this.mapService.showSLider();
        }
        else{
            //hiding the slider div
            let copy = this.getCopyOfOptions();
            copy.componentDisabled = false;
            this.myDateRangePickerOptions = copy;

            this.model = {
                beginDate: {year: this.actutalStartDate.getFullYear() , month: (this.actutalStartDate.getMonth()+1), day: this.actutalStartDate.getDate()},
                endDate: {year: this.actualEndDate.getFullYear() , month: (this.actualEndDate.getMonth()+1), day: this.actualEndDate.getDate()}
            };
            

            this.isSliderBoxChecked = false;
            this.mapService.isSliderShowed.next(false);
        }
    }

    // Returns copy of myOptions
    getCopyOfOptions(): IMyDpOptions {
        return JSON.parse(JSON.stringify(this.myDateRangePickerOptions));
    }
    
}