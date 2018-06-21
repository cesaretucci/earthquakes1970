import {Component} from '@angular/core';
import {MapService} from '../../services/map.service';

@Component({
    selector: 'vizoptions-panel',
    template: require<any>('./vizoptionspanel.component.html'),
    styles: [require<any>('./vizoptionspanel.component.less')],
    providers:[]
})
export class VizOptionsPanelComponent{
    private mapService: MapService;
    
    constructor(mapService: MapService) {
        this.mapService=mapService;
    }

    tradeSources = [
        {
            id: '0',
            name: 'Markers',
            checked: false,
            showFunctionName: 'showMarkers',
            hideFunctionName: 'hideMarkers'
        },
        {
            id: '1',
            name: 'Clustering points',
            checked: false,
            showFunctionName: 'showClusteringPoints',
            hideFunctionName: 'hideClusteringPoints'
        },
        {
            id: '2',
            name: 'Heatmap',
            checked: false,
            showFunctionName: 'showHeatMap',
            hideFunctionName: 'hideHeatMap'
        }
    ];
    
    update(i){
        this.mapService.updateBoxList(i.id);
    }

    ngOnInit() {
        this.mapService.saveList(this.tradeSources);
    }
}//EXPORT CLASS CLOSED