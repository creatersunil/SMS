import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './registration.routing';

import { DatePickerModule } from 'ng2-datepicker';

import { RatingModule } from 'ng2-bootstrap';
import {RegistrationComponent} from './registration.component';
//import { StaffRegComponent } from './components/staff/staff-reg.component';
import { StaffRegistrationComponent } from './components/Staff-registration/staff-registration.component';
//import { StudentRegComponent } from './components/student/student-reg.component';
import { ReactiveFormsModule} from '@angular/forms';
import {OnlyNumber} from './numberonly.directive';
import { NgUploaderModule } from 'ngx-uploader';
import {StudentRegistrationComponent} from './components/student-registration/student-registration.component'

//import { DropdownModule, ModalModule } from 'ng2-bootstrap';
//import {MyDatePicker} from 'MyDatePicker/src/index'
@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    NgaModule,
    RatingModule.forRoot(),
    routing,
    ReactiveFormsModule,
    DatePickerModule,
   
    NgUploaderModule,
   ///  DropdownModule.forRoot(),
  //  ModalModule.forRoot(),
    //MyDatePicker
  ],
  declarations: [
      RegistrationComponent,
      // StaffRegComponent,
      StaffRegistrationComponent,
      // StudentRegComponent,
      OnlyNumber,
      StudentRegistrationComponent
      ]
})
export class RegistrationModule {
}