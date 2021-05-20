import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Login } from './login.component';
import { routing }       from './login.routing';

import { LoadingModule , ANIMATION_TYPES  } from 'ngx-loading';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,   
    LoadingModule
  ],
  declarations: [
    Login
  ]
})
export class LoginModule {}
