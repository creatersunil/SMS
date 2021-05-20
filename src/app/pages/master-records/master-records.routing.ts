import { Routes, RouterModule }  from '@angular/router';

import { MasterRecordsComponent } from './master-records.component';
import {MasterLeaveComponent} from './components/master-leave/master-leave.component';
import {MasterCityComponent} from './components/master-city/master-city.component';
import  {MasterCountryComponent} from './components/master-country/master-country.component';
import  {MasterAffiliationComponent} from './components/master-affiliation/master-affiliation.component';
import {MasterSubjectsComponent} from './components/master-subjects/master-subjects.component';
import {MasterMaritalStatusComponent} from './components/master-maritalStatus/master-maritalStatus.component';
import {MasterMotherTongueComponent} from './components/master-motherTongue/master-motherTongue.component';
import{MasterUserTypeComponent} from './components/master-user-type/master-user-type.component';
import {MasterStateComponent} from './components/master-state/master-state.component';
import {MasterFeesDetailsComponent} from './components/master-fees-details/master-fees-details.component';
import {MasterPaymentModeComponent} from './components/master-payment-mode/master-payment-mode.component';
import {MasterWeekComponent} from './components/master-week/master-week.component';
import {MasterStreamComponent} from './components/master-stream/master-stream.component';
import {MasterSocialCategoryComponent} from './components/master-social-category/master-social-category.component';
import {MasterFeeTypeDetails} from './components/master-fee-type-details/master-fee-type-details.component';
import {MasterCSCtComponent} from './components/master-csct/master-csct.component';
import {MasterDistrictComponent} from './components/master-district/master-district.component';
import {MasterTalukComponent} from './components/master-taluk/master-taluk.component';
import {MstSectionComponent  } from './components/mst_section/mst_section.component';
import {MstSkills} from './components/mst_skills/mst_skills.component';
import {MstClassComponent} from './components/mst_class/mst_class.component';
import {MstFeetypeComponent} from './components/mst_feetype/mst_feetype.component';
import {MstDepartmentComponent} from './components/mst_department/mst_department.component';
import { MstEventComponent } from './components/mst_event_types/mst_event_types.component';
import { MstExamsComponent } from './components/mst_exams_terms/mst_exams_terms.component';
import { MstReligionComponent } from './components/mstreligion/mstreligion.component';
import { MstDisabilityComponent } from './components/mst_disabilitychild/mst_disabilitychild.component';
import { MstTimingComponent } from './components/mst_timings/mst_timings.component';
import {OrgStaffComponent} from './components/org_staff_reporting/org_staff_reporting.component';

import {ViewListComponent} from './components/view-list/view-list.component';
import {GroupViewComponent} from './components/group-default-views/group-views.component';
import {ApplicationViewComponent} from './components/application-views/application-view.component';
import {GroupViewAccessComponent} from './components/group-view-access/group-view-access.component';
// noinspection TypeScriptValidateTypes

import {LoggedIn,IsAccessible }from '../../services';

const routes: Routes = [
  {
    path: '',
    component: MasterRecordsComponent,
    children: [
    {path:'configuration',
      children:[
        {path :'city' , component :MasterCityComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'country', component:MasterCountryComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'state' ,component:MasterStateComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'district' ,component:MasterDistrictComponent,canActivate:[LoggedIn,IsAccessible] },
         {path :'taluk' ,component:MasterTalukComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'affiliation' ,component :MasterAffiliationComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'user-type', component :MasterUserTypeComponent,canActivate:[LoggedIn,IsAccessible] },
      ]
     },
     {path:'school',
      children:[
        {path :'subjects' ,component:MasterSubjectsComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'week' ,component:MasterWeekComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mst_timings',component:MstTimingComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mst_class',component:MstClassComponent,canActivate:[LoggedIn,IsAccessible]},
        { path: 'mst_section', component: MstSectionComponent,canActivate:[LoggedIn,IsAccessible] },
        {path :'stream' ,component:MasterStreamComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mst_exams_terms',component:MstExamsComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mst_event_types',component:MstEventComponent,canActivate:[LoggedIn,IsAccessible]},
        {path : 'motherTongue' ,component :MasterMotherTongueComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mstreligion',component:MstReligionComponent,canActivate:[LoggedIn,IsAccessible]},
        {path :'social-category' ,component:MasterSocialCategoryComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mst_disabilitychild',component:MstDisabilityComponent,canActivate:[LoggedIn,IsAccessible]},
      ]
     },

      {path:'organization',
      children:[
        { path:'mst_department',component:MstDepartmentComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'org_staff_reporting',component:OrgStaffComponent,canActivate:[LoggedIn,IsAccessible]},
       {path :'leave' , component :MasterLeaveComponent,canActivate:[LoggedIn,IsAccessible]},
        { path:'mst_skills',component:MstSkills,canActivate:[LoggedIn,IsAccessible]},
       {path :'MaritalStatus',component:MasterMaritalStatusComponent,canActivate:[LoggedIn,IsAccessible]},
       {path: 'master-csct', component:MasterCSCtComponent,canActivate:[LoggedIn,IsAccessible]}
       
      ]
     },

     {path:'payments',
      children:[
        {path :'fees-details', component:MasterFeesDetailsComponent,canActivate:[LoggedIn,IsAccessible]},
        {path :'fee-type-details', component:MasterFeeTypeDetails,canActivate:[LoggedIn,IsAccessible]},
        {path :'payment-mode' ,component:MasterPaymentModeComponent,canActivate:[LoggedIn,IsAccessible]},
       ]
     },

     {path:'access',
      children:[
        {path :'view-list' ,component:ViewListComponent,canActivate:[LoggedIn,IsAccessible]},
        {path :'group-view' ,component:GroupViewComponent},
        {path :'application-view',component:ApplicationViewComponent,canActivate:[LoggedIn,IsAccessible]},
        {path: 'group-view-access',component:GroupViewAccessComponent,canActivate:[LoggedIn,IsAccessible]}
       ]
     } 
    ]
  }
];

export const routing = RouterModule.forChild(routes);