import { Routes, RouterModule }  from '@angular/router';

import { MasterRecordsView } from './master-recordsview.component';
//import { BasicTables } from './components/basicTables/basicTables.component';
import { StudentsRecordsView } from './components/studentsrecordsview/students-records-view.component';
import {StudentProfileComponent} from './components/student_profile/student-profile.component';
import { TeachersRecordsView } from './components/teachers_records_view/teachers-records-view.component';
import {TeacherProfileComponent} from './components/teacher_profile/teacher-profile.component';
// noinspection TypeScriptValidateTypes
import {LoggedIn,IsAccessible }from '../../services';

const routes: Routes = [
  {
    path: '',
    component: MasterRecordsView,
    children: [
      //{ path: 'basictables', component: BasicTables },
      { path: 'students-records-view', component: StudentsRecordsView,canActivate:[LoggedIn,IsAccessible] },
       { path: 'teachers-records-view', component: TeachersRecordsView,canActivate:[LoggedIn,IsAccessible] },
      { path: 'student-profile-view/:id', component: StudentProfileComponent,canActivate:[LoggedIn,IsAccessible] },
      { path: 'teacher-profile-view/:id', component: TeacherProfileComponent,canActivate:[LoggedIn,IsAccessible] }
     // { path:'leavetype',component:LeaveType}
    ]
  }
];

export const routing = RouterModule.forChild(routes);
