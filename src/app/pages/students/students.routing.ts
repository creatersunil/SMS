import { Routes, RouterModule } from '@angular/router';
import { LoggedIn, IsAccessible } from '../../services';

import { StudentsComponent } from './students.component';
import { ListComponent } from './list/list.component';
import { RegistrationComponent } from './registration/registration.component';
import { AttendanceLeavesComponent } from './attendance-leaves/attendance-leaves.component';
import { ResultsComponent } from './results/results.component';
import { StudentFeePaymentComponent } from './student-fee-payment/student-fee-payment.component';

const routes: Routes = [
  {
    path: '',
    component: StudentsComponent,
    children: [
      { path: 'list', component: ListComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'attendance-leaves', component: AttendanceLeavesComponent },
      { path: 'students-results', component: ResultsComponent },
      { path: 'student-fee-payment', component: StudentFeePaymentComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);