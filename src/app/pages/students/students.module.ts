import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { OnlyNumber } from '../../utils';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from 'ng2-data-table';
import { OrderModule } from 'ngx-order-pipe';
import { TabsModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { routing } from './students.routing';
import { StudentsComponent } from './students.component';
import { ListComponent } from './list/list.component';
import { RegistrationComponent } from './registration/registration.component';
import { AttendanceLeavesComponent } from './attendance-leaves/attendance-leaves.component';
import { ResultsComponent } from './results/results.component';
import { SnotifyModule, SnotifyService } from 'ng-snotify';
import { StudentFeePaymentComponent } from './student-fee-payment/student-fee-payment.component';
// import { UtilsService } from './../../utils/utils.service';
@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    DataTableModule,
    OrderModule,
    TabsModule.forRoot(),
    ChartsModule,
    Ng2SearchPipeModule,
    SnotifyModule
  ],
  declarations: [
    StudentsComponent,
    ListComponent,
    RegistrationComponent,
    OnlyNumber,
    AttendanceLeavesComponent,
    ResultsComponent,
    StudentFeePaymentComponent,
  ],
  providers: [SnotifyService]
})
export class StudentsModule {
}