import { Routes, RouterModule }  from '@angular/router';

import { Register } from './register.component';
import {LoggedIn , IsAccessible}from '../../services';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Register,
    canActivate:[LoggedIn,IsAccessible]
  }
];

export const routing = RouterModule.forChild(routes);
