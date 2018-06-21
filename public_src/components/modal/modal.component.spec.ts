import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {ModalComponent} from './modal.component';

describe('ModalComponent test unit', ()=>{
	let component: ModalComponent;
	let fixture: ComponentFixture<ModalComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	
	beforeEach(async(() => {
		TestBed.configureTestingModule({
		  declarations: [ModalComponent]
		}).compileComponents();
	}));
	
	beforeEach(()=>{
		fixture=TestBed.createComponent(ModalComponent);
		
		component=fixture.componentInstance;
		
		de=fixture.debugElement.query(By.css('.modal-content'));
		el=de.nativeElement;
		
		 fixture.detectChanges();
	});
	
	
	it('should create', ()=>{
		expect(component).toBeTruthy();
	});
	
	it('should display the header text', ()=>{
		let header=fixture.debugElement.query(".modal-header");
		expect(header.textContent).not.toBeNull();
		
		expect(header.textContent).not.toBeUndefined();
	});
	
});
