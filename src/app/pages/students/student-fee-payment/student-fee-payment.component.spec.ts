import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFeePaymentComponent } from './student-fee-payment.component';

describe('SudentFeePaymentComponent', () => {
  let component: StudentFeePaymentComponent;
  let fixture: ComponentFixture<StudentFeePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentFeePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentFeePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
