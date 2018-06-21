import {ReadersPerYear} from './ReadersPerYear.interface';

export class DateNumberReaders implements ReadersPerYear {
    public date: Date;
    public numberOfReaders: number;

    constructor (theDate: Date; theNumberOfReaders: number){
        this.date = theDate;
    	this.numberOfReaders = theNumberOfReaders;
    }
}
