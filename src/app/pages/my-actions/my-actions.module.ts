import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { OnlyNumber } from '../../utils';
import { ReactiveFormsModule } from '@angular/forms';
import { MyActionsComponent } from './my-actions.component';
import { routing } from './my-actions.routing';
import { DataTableModule } from 'ng2-data-table';
import { SnotifyService, SnotifyModule } from 'ng-snotify';
import { DbService } from '../../services/dbservices';
import { MyAttendanceComponent } from './components/my-attendance/my-attendance.component';
import { MyLeavesComponent } from './components/my-leaves/my-leaves.component';
import { MyDocumentsComponent } from './components/my-documents/my-documents.component';
@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    NgaModule,
    routing,
    ReactiveFormsModule,
    DataTableModule,
    SnotifyModule,
  ],
  declarations: [MyActionsComponent, MyAttendanceComponent, MyLeavesComponent, MyDocumentsComponent],
  providers: [SnotifyService,DbService],
})
export class MyActionsModule { }
