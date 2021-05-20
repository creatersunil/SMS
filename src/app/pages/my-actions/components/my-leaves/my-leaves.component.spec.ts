import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLeavesComponent } from './my-leaves.component';

describe('MyLeaveComponent', () => {
  let component: MyLeavesComponent;
  let fixture: ComponentFixture<MyLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyLeavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
