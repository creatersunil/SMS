import { Routes, RouterModule }  from '@angular/router';

import { RegistrationComponent } from './registration.component';
// import { StaffRegComponent } from './components/staff/staff-reg.component';
import { StaffRegistrationComponent } from './components/Staff-registration/staff-registration.component';
// import {StudentRegComponent} from './components/student/student-reg.component';
import {LoggedIn , IsAccessible}from '../../services';
import {StudentRegistrationComponent} from './components/student-registration/student-registration.component'
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: RegistrationComponent,
    children: [
      // { path: 'staff-reg/:id', component: StaffRegComponent ,canActivate:[LoggedIn] },
      { path: 'staff-registration', component: StaffRegistrationComponent,canActivate:[LoggedIn,IsAccessible]  },
      // { path: 'student-reg/:id', component: StudentRegComponent,canActivate:[LoggedIn]  },
      {path: 'student-registration' ,component :StudentRegistrationComponent,canActivate:[LoggedIn,IsAccessible]}
    ]
  }
];

export const routing = RouterModule.forChild(routes);