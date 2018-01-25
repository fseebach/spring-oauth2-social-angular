import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Oauth2connectComponent } from './oauth2connect.component';

describe('Oauth2connectComponent', () => {
  let component: Oauth2connectComponent;
  let fixture: ComponentFixture<Oauth2connectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Oauth2connectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Oauth2connectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
