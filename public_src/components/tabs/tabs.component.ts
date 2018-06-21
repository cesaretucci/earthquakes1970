import { Component, EventEmitter, Output } from '@angular/core';
import { Tab } from './tab.interface';
import { TabComponent} from './tab.component';

@Component({
  selector: 'my-tabs',
  template: require<any>('./tabs.component.html'),
   styles: [require<any>('./tabs.component.less')]
})

export class TabsComponent{
  tabs:Tab[] = [];
  @Output() selectedT = new EventEmitter();

  selectedTabIndex = 0;
  
  addTab(tab:Tab) {
      if(!this.tabs.length) {
           tab.selectedT=true;
      }

      this.tabs.push(tab);
  }

  selectTab(tab:Tab, i:Number){
      this.tabs.map((tab) => {
          tab.selectedT = false;
      })
      tab.selectedT=true;
      this.selectedT.emit({selectedTab: tab});

      this.selectedTabIndex = i;
  }

}