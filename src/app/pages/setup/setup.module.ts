import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { ReactiveFormsModule } from '@angular/forms';
// import { RatingModule } from 'ng2-bootstrap';
// import { CustomFormsModule } from 'ng2-validation'
// import { ModalModule } from 'ng2-bootstrap';
import { NgUploaderModule } from 'ngx-uploader';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
// import { UiSwitchModule } from 'angular2-ui-switch'

import { routing } from './setup.routing';
import { Setup } from './setup.component';
import { SchoolComponent } from './components/school/school.component';
import { ClassSubjectTeacherComponent } from './components/class-subject-teacher/class-subject-teacher.component'
import { FeeComponent } from './components/fee/fee.component';

import { CalendarTimetableHolidayComponent } from './components/calendar-timetable-holiday/calendar-timetable-holiday.component'

import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { SnotifyService, SnotifyModule } from 'ng-snotify';
import { Ng2PaginationModule } from 'ng2-pagination';
import { DataTableModule } from "ng2-data-table";

import { CalendarService } from './components/calendar-timetable-holiday/calendar.service';

import { DbService } from '../../services/dbservices';
import { AlertModule } from 'ngx-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { OnlyNumber } from './numberonly.directive';
import { UserSetupComponent } from './user-setup/user-setup.component';
import { TimeTable,ChildTimeTable } from './components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    // RatingModule.forRoot(),
    AlertModule.forRoot(),
    //  DropdownModule.forRoot(),
    // ModalModule.forRoot(),
    DataTableModule,
    NgUploaderModule,

    // UiSwitchModule,
    SnotifyModule,

    Ng2PaginationModule,
    LoadingModule,
    ColorPickerModule

  ],
  declarations: [
    Setup,
    SchoolComponent,
    ClassSubjectTeacherComponent,
    FeeComponent,
    CalendarTimetableHolidayComponent,
    CurriculumComponent,
    OnlyNumber,
    UserSetupComponent,
    TimeTable,
    ChildTimeTable
  ],

  providers: [SnotifyService, CalendarService, DbService]
})
export class SetupModule { }
