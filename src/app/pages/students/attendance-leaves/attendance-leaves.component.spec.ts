import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceLeavesComponent } from './attendance-leaves.component';

describe('AttendanceLeavesComponent', () => {
  let component: AttendanceLeavesComponent;
  let fixture: ComponentFixture<AttendanceLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceLeavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
