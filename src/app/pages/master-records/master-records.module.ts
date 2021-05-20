import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule as AngularFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { routing }       from './master-records.routing';
// import { DatePickerModule } from 'ng2-datepicker';
import { ReactiveFormsModule} from '@angular/forms';
import { RatingModule } from 'ng2-bootstrap';
import {MasterRecordsComponent} from './master-records.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {MasterLeaveComponent} from './components/master-leave/master-leave.component'
import {MasterCityComponent} from './components/master-city/master-city.component';
import  {MasterCountryComponent} from './components/master-country/master-country.component';
import  {MasterAffiliationComponent} from './components/master-affiliation/master-affiliation.component';
import {MasterSubjectsComponent} from './components/master-subjects/master-subjects.component';
import {MasterMaritalStatusComponent} from './components/master-maritalStatus/master-maritalStatus.component';
import {MasterMotherTongueComponent} from './components/master-motherTongue/master-motherTongue.component';
import{MasterUserTypeComponent} from './components/master-user-type/master-user-type.component';
import {MasterStateComponent} from './components/master-state/master-state.component';
import {MasterDistrictComponent} from './components/master-district/master-district.component';
import {MasterTalukComponent} from './components/master-taluk/master-taluk.component';
import {MasterFeesDetailsComponent} from './components/master-fees-details/master-fees-details.component';
import {MasterPaymentModeComponent} from './components/master-payment-mode/master-payment-mode.component';
import {MasterWeekComponent} from './components/master-week/master-week.component';
import {MasterStreamComponent} from './components/master-stream/master-stream.component';
import {MasterSocialCategoryComponent} from './components/master-social-category/master-social-category.component';
import {MasterFeeTypeDetails} from './components/master-fee-type-details/master-fee-type-details.component';
import {MasterCSCtComponent} from './components/master-csct/master-csct.component';

import { MstSkills } from './components/mst_skills/mst_skills.component';
import { MstSectionComponent } from './components/mst_section/mst_section.component';
import { MstClassComponent } from './components/mst_class/mst_class.component';
import { MstFeetypeComponent } from './components/mst_feetype/mst_feetype.component';
import { MstDepartmentComponent } from './components/mst_department/mst_department.component';
import { MstEventComponent } from './components/mst_event_types/mst_event_types.component';
import { MstExamsComponent } from './components/mst_exams_terms/mst_exams_terms.component';
import { MstReligionComponent } from './components/mstreligion/mstreligion.component';
import { MstDisabilityComponent } from './components/mst_disabilitychild/mst_disabilitychild.component';
import { MstTimingComponent } from './components/mst_timings/mst_timings.component';
//import {LeaveType} from './components/leavetype/leavetype.component';
import {OrgStaffComponent} from './components/org_staff_reporting/org_staff_reporting.component';

import {ViewListComponent} from './components/view-list/view-list.component';
import {GroupViewComponent} from './components/group-default-views/group-views.component';
import {ApplicationViewComponent} from './components/application-views/application-view.component';
import {GroupViewAccessComponent} from './components/group-view-access/group-view-access.component';

import { ModalModule } from 'ng2-bootstrap';
@NgModule({
  imports: [
    CommonModule,
    AngularFormsModule,
    NgaModule,
    RatingModule.forRoot(),
    routing,
    ReactiveFormsModule,
    // DatePickerModule,
    Ng2SmartTableModule,
    //  DropdownModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [
      MasterRecordsComponent,
      MasterLeaveComponent,
      MasterCityComponent,
      MasterCountryComponent,
      MasterAffiliationComponent,
      MasterSubjectsComponent,
      MasterMaritalStatusComponent,
      MasterMotherTongueComponent,
      MasterUserTypeComponent,
      MasterStateComponent,
      MasterFeesDetailsComponent,
      MasterPaymentModeComponent,
      MasterWeekComponent,
      MasterStreamComponent,
      MasterSocialCategoryComponent,
      MasterFeeTypeDetails,
      MasterCSCtComponent,
      MasterDistrictComponent,
      MasterTalukComponent,
      MstFeetypeComponent,
      MstClassComponent,
      MstSectionComponent,
      MstSkills,
      MstDepartmentComponent,
      MstEventComponent,
      MstReligionComponent,
      MstDisabilityComponent,
      MstTimingComponent,
      OrgStaffComponent,
      MstExamsComponent,

      ViewListComponent,
      GroupViewComponent,
      ApplicationViewComponent,
      GroupViewAccessComponent
      
       ]
})
export class MasterRecordsModule {
}