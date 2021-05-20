import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarTimetableHolidayComponent } from './calendar-timetable-holiday.component';

describe('CalendarTimetableHolidayComponent', () => {
  let component: CalendarTimetableHolidayComponent;
  let fixture: ComponentFixture<CalendarTimetableHolidayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarTimetableHolidayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarTimetableHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
