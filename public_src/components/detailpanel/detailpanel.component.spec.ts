import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DetailPanelComponent } from './detailpanel.component';
import {ModalComponent} from '../modal/modal.component';

describe('DetailPanelComponent test unit', ()=>{
	let component: DetailPanelComponent;
	let fixture: ComponentFixture<DetailPanelComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	
	beforeEach(async(() => {
		TestBed.configureTestingModule({
		  declarations: [DetailPanelComponent, ModalComponent]
		}).compileComponents();
	}));
	
	beforeEach(()=>{
		fixture=TestBed.createComponent(DetailPanelComponent);
		
		component=fixture.componentInstance;
		
		de=fixture.debugElement.query(By.css('#modal1'));
		el=de.nativeElement;
		
		 fixture.detectChanges();
	});
	
	
	it('should create', ()=>{
		expect(component).toBeTruthy();
	});
	
	it('should load the title', ()=>{
		
	});
	
});
