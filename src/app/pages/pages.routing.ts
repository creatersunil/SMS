import { EventsModule } from './events/events.module';
import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';

import { LoggedIn, IsAccessible } from '../services';

// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'forgot-password',
    loadChildren: 'app/pages/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'reset-password',
    loadChildren: 'app/pages/reset-password/reset-password.module#RestetPasswordModule'
  },
  // {
  //   path: 'register',
  //   loadChildren: 'app/pages/register/register.module#RegisterModule'
  // },
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule',
        canActivate: [LoggedIn, IsAccessible]
      },
      {
        path: 'registration',
        loadChildren: 'app/pages/registration/registration.module#RegistrationModule',
        canActivate: [LoggedIn, IsAccessible]
      },
      {
        path: 'master-recordsview',
        loadChildren: 'app/pages/masterview/master-recordsview.module#MasterRecordsViewModule',
        canActivate: [LoggedIn, IsAccessible]
      },
      {
        path: 'master-records',
        loadChildren: 'app/pages/master-records/master-records.module#MasterRecordsModule',
        canActivate: [LoggedIn, IsAccessible]
      },
      {
        path: 'setup', loadChildren: 'app/pages/setup/setup.module#SetupModule',
        canActivate: [LoggedIn, IsAccessible]
      },
      {
        path: 'students', loadChildren: 'app/pages/students/students.module#StudentsModule',
      },
      {
        path: 'teachers', loadChildren: 'app/pages/teachers/teachers.module#TeachersModule',
      },
      {
        path: 'events', loadChildren: 'app/pages/events/events.module#EventsModule'
      },
      {
        path: 'my-actions', loadChildren: 'app/pages/my-actions/my-actions.module#MyActionsModule',
      },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
