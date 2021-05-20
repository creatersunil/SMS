import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { OnlyNumber } from '../../utils';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "ng2-data-table";
// import { OrderModule } from 'ngx-order-pipe';
import { TabsModule } from 'ngx-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2PaginationModule } from 'ng2-pagination';
import { SnotifyService, SnotifyModule } from 'ng-snotify';

import { routing } from './teachers.routing';
import { TeachersComponent } from './teachers.component';
import { TeachersListComponent } from './teachers-list/teachers-list.component';
import { TeachersRegistrationComponent } from './teachers-registration/teachers-registration.component';
import { AttendanceLeaveComponent } from './attendance-leave/attendance-leave.component';

@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    DataTableModule,
    // OrderModule,
    TabsModule.forRoot(),
    Ng2SearchPipeModule,
    Ng2PaginationModule,
    ChartsModule,
    SnotifyModule
  ],
  declarations: [
    TeachersComponent,
    TeachersListComponent,
    TeachersRegistrationComponent,
    AttendanceLeaveComponent],
    
    providers: [SnotifyService]
})
export class TeachersModule { }
