import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { ForgotPasswordComponent } from './forgot-password.component';
import { routing }       from './forgot-password.routing';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    routing,
  ],
  declarations: [
    ForgotPasswordComponent
  ]
})
export class ForgotPasswordModule {}
