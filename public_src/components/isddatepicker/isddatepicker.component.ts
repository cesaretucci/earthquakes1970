
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {DateConversion} from './dateconversion.pipe';
@Component({
    selector: 'my-datepicker',
    template: require<any>('./isddatepicker.component.html'),
    styles: [
        require<any>('./isddatepicker.component.less')
       ],
})

export class IsdDatepickerComponent {
    /*
    @Input()
     dateModel: Date;
    @Input()
    label: string;

    @Input()
    minDate: Date;
    @Input()
    maxDate: Date;
    @Output()
    dateModelChange: EventEmitter<string> = new EventEmitter();
    private showDatepicker: boolean = false;
     public formats:Array<string> = ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
    public format:string = this.formats[0]; 

    constructor(){
        (this.minDate = new Date()).setDate(this.minDate.getDate() - 1000);
    }
    showPopup() {
        this.showDatepicker = true;
        
    }

    hidePopup(event) {
        this.showDatepicker = false;
        this.dateModel = event;
        this.dateModelChange.emit(event)
    }

     ngOnInit() {
                 this.dateModel = new Date(this.minDate.valueOf());

     }
     */
     
}