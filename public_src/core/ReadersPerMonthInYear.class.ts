import {ReadersPerYear} from './ReadersPerYear.interface';

export class ReadersPerMonthInYear implements ReadersPerYear {
    public nyear: number;
    public month: number;
    public numberOfReaders: number;
    public date: Date;

    constructor (theYear: number; theMonth: number; theNumberOfReaders: number; theDate: Date){
    	this.nyear = theYear;
    	this.month = theMonth;
    	this.numberOfReaders = theNumberOfReaders;
    	this.date = theDate;
    }
}
