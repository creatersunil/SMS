import { Routes, RouterModule } from '@angular/router';
import { LoggedIn, IsAccessible } from '../../services';

import { TeachersComponent } from './teachers.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { TeachersRegistrationComponent } from './teachers-registration/teachers-registration.component';
import { AttendanceLeaveComponent } from './attendance-leave/attendance-leave.component';
const routes: Routes = [
    {
        path: '',
        component: TeachersComponent,
        children: [
            { path: 'teachers-list', component: TeachersListComponent, canActivate: [LoggedIn, IsAccessible] },
            { path: 'teachers-registration', component: TeachersRegistrationComponent, canActivate: [LoggedIn, IsAccessible] },
            { path: 'teachers-attendance-leave', component: AttendanceLeaveComponent, canActivate: [LoggedIn, IsAccessible] }
        ]
    }
];

export const routing = RouterModule.forChild(routes);