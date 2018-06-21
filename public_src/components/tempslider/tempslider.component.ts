import {Component, Directive, ViewEncapsulation} from '@angular/core';
import { MapService} from '../../services/map.service';
import { Subscription }   from 'rxjs/Subscription';

@Component({
    selector: 'temp-slider',
    encapsulation: ViewEncapsulation.None,
    template: require<any>('./tempslider.component.html'),
    styles: [require<any>('./tempslider.component.less')],
    providers:[]
})
export class TempSliderComponent {
    public active : Boolean;
    subscription: Subscription;

	constructor (private mapService: MapService){
        this.mapService=mapService;

		this.subscription = mapService.isSliderShowed$.subscribe(
            active => {
                    this.active=active;
                }
        );
    }

	toggleActive() {
        if(this.active) {
            this.active = false;
        } else {
            this.active = true;
        }
    }

    ngOnInit(): void{
       this.mapService.isSliderShowed.next(false);
    }
}