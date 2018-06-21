import {Component} from '@angular/core';
var jQuery = require ("jquery");

@Component({
  selector: 'app-modal',
  template: require<any>('./modal.component.html'),
  styles: [
    require<any>('./modal.component.less'),
  ]
})

export class ModalComponent {

  public visible = false;
  private visibleAnimate = false;

  constructor(){}

  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }

  public ngAfterViewInit(){
    jQuery('.modal-dialog').draggable();
    jQuery('.modal-dialog').resizable({
        aspectRatio: true,
        minHeight: 500,
      });
  }
}