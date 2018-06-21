import { Component, Input, OnInit } from '@angular/core';
import { Tab } from './tab.interface';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'my-tab',
  template: require<any>('./tab.component.html'),
  styles: [require<any>('./tab.component.less')]
})
export class TabComponent implements OnInit, Tab {
  
  @Input() tabTitle;
  @Input() selectedT;
  constructor(private tabsComponent: TabsComponent) {}
  
  ngOnInit() {
    this.tabsComponent.addTab(this);
  }
}