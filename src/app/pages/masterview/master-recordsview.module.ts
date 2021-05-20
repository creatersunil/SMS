import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RatingModule } from 'ng2-bootstrap';
import { routing }       from './master-recordsview.routing';
import { MasterRecordsView } from './master-recordsview.component';
import { ReactiveFormsModule} from '@angular/forms';
//import { DropdownModule, ModalModule } from 'ng2-bootstrap';
//import { BasicTables } from './components/basicTables/basicTables.component';
//import { BasicTablesService } from './components/basicTables/basicTables.service';
//import { ResponsiveTable } from './components/basicTables/components/responsiveTable';
//import { StripedTable } from './components/basicTables/components/stripedTable';
//import { BorderedTable } from './components/basicTables/components/borderedTable';
//import { HoverTable } from './components/basicTables/components/hoverTable';
//import { CondensedTable } from './components/basicTables/components/condensedTable';
//import { ContextualTable } from './components/basicTables/components/contextualTable';
import { StudentsRecordsView ,ButtonViewComponent } from './components/studentsrecordsview/students-records-view.component';
import { TeachersRecordsView,StaffButtonViewComponent } from './components/teachers_records_view/teachers-records-view.component';
import { StudentProfileComponent } from './components/student_profile/student-profile.component';
import { TeacherProfileComponent } from './components/teacher_profile/teacher-profile.component';
//import { AdminTimetableService } from './components/admintimetable/admintimetable.service';
//import {LeaveType} from './components/leavetype/leavetype.component';

@NgModule({
  imports: [
    CommonModule,
   AngularFormsModule,
    NgaModule,
    routing,
    Ng2SmartTableModule,
     ReactiveFormsModule,
      RatingModule.forRoot(),
   

  ],
  declarations: [
    MasterRecordsView,
    ButtonViewComponent,
    StaffButtonViewComponent,
   // BasicTables,
   // HoverTable,
   // BorderedTable,
   //CondensedTable,
    //StripedTable,
    //ContextualTable,
    //ResponsiveTable,
    StudentsRecordsView,
    TeachersRecordsView,
    StudentProfileComponent,
    TeacherProfileComponent
    //LeaveType
  ],
   entryComponents:[
    ButtonViewComponent,
    StaffButtonViewComponent
  ],
  providers: [
   // BasicTablesService,
    //AdminTimetableService,
  ]
})
export class MasterRecordsViewModule {
}
