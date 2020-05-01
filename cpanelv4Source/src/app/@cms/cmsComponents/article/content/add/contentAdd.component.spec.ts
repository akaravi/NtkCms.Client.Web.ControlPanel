/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContentAddComponent } from './contentAdd.component';

describe('ContentAddComponent', () => {
  let component: ContentAddComponent;
  let fixture: ComponentFixture<ContentAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
