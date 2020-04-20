/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContentLIstComponent } from './contentLIst.component';

describe('ContentLIstComponent', () => {
  let component: ContentLIstComponent;
  let fixture: ComponentFixture<ContentLIstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentLIstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentLIstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
