import {Pipe, PipeTransform} from '@angular/core'; 
import * as moment from 'moment';
@Pipe({ 
        name: "dateconversion"
    })
    export class DateConversion implements PipeTransform{
        transform(datestring){
            let readableDate = new Date(datestring)
             
            return moment(readableDate).format('DD/MM/YYYY');
        }
    }