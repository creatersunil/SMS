import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersRegistrationComponent } from './teachers-registration.component';

describe('TeachersRegistrationComponent', () => {
  let component: TeachersRegistrationComponent;
  let fixture: ComponentFixture<TeachersRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachersRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachersRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
