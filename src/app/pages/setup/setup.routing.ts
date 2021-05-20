import { Routes, RouterModule } from '@angular/router';
import { Setup } from './setup.component';
import { SchoolComponent } from './components/school/school.component';
import { ClassSubjectTeacherComponent } from './components/class-subject-teacher/class-subject-teacher.component'
import { LoggedIn, IsAccessible } from '../../services';
import { FeeComponent } from './components/fee/fee.component';
import { CalendarTimetableHolidayComponent } from './components/calendar-timetable-holiday/calendar-timetable-holiday.component';
import { CurriculumComponent } from './components/curriculum/curriculum.component';
import { UserSetupComponent } from './user-setup/user-setup.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
    {
        path: '',
        component: Setup,
        children: [

            { path: 'school', component: SchoolComponent, canActivate: [LoggedIn, IsAccessible] },
            {
                path: 'app-class-subject-teacher'
                , component: ClassSubjectTeacherComponent, canActivate: [LoggedIn, IsAccessible]
            },
            { path: 'fee', component: FeeComponent, canActivate: [LoggedIn, IsAccessible] },
            { path: 'cal-time-hol', component: CalendarTimetableHolidayComponent, canActivate: [LoggedIn, IsAccessible] },
            { path: 'curriculum', component: CurriculumComponent, canActivate: [LoggedIn, IsAccessible] },
            { path: 'user-setup', component: UserSetupComponent, canActivate: [LoggedIn, IsAccessible] }


        ],
    },
];

export const routing = RouterModule.forChild(routes);
