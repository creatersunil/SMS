import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSubjectTeacherComponent } from './class-subject-teacher.component';

describe('ClassSubjectTeacherComponent', () => {
  let component: ClassSubjectTeacherComponent;
  let fixture: ComponentFixture<ClassSubjectTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassSubjectTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassSubjectTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
