import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyActionsComponent } from './my-actions.component';

describe('MyActionsComponent', () => {
  let component: MyActionsComponent;
  let fixture: ComponentFixture<MyActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
