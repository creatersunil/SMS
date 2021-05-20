import { Routes, RouterModule } from '@angular/router';
import { LoggedIn, IsAccessible } from '../../services';
import { MyAttendanceComponent } from './components/my-attendance/my-attendance.component';
import { MyLeavesComponent } from './components/my-leaves/my-leaves.component';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
import { MyActionsComponent } from './my-actions.component';
const routes: Routes = [
    {
        path: '',
        component: MyActionsComponent,
       children: [
      {
        path: 'my-attendance', component: MyAttendanceComponent
      },
      {
        path: 'my-leaves', component: MyLeavesComponent
      },
      {
        path: 'my-documents', component: MyDocumentsComponent
      }
    ]
    }
];

export const routing = RouterModule.forChild(routes);
