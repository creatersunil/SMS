import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
//import { BaseHttpService} from '../../../../dbservices/base-http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RegistrationLoadType } from './registrationtableload';
import { StaffLoadType } from './staffTableLoad';

import { DbService } from '../../../../services';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import 'style-loader!./teachers-records-view.scss';
import { Logs } from '../../../../services';


@Component({
  selector: 'button-view',
  template: `  
    <button  class="btn btn-primary btn-xs btn-with-icon" type="button">
    <i class="ion-edit"></i>Edit</button>
  `,
})
export class StaffButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;
  edit: boolean = true;

  @Input() value: string | number;

  constructor() { }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

  showAlert() {


    //alert(this.renderValue);
  }
}


@Component({
  selector: 'teachers-records-view',
  templateUrl: './teachers-records-view.html',
  providers: [DbService, Logs]
})

export class TeachersRecordsView implements OnInit {

  edit: boolean = true;

  source = new LocalDataSource();


  settings = {
    actions: {
      delete: false,
      add: false,
      edit: false
    },
    columns: {
      intRegistrationId: {
        title: 'Staff ID'
      },
      txtFirstName: {
        title: 'Staff Name'
      },
      button: {
        title: 'Action',
        type: 'custom',
        renderComponent: StaffButtonViewComponent,
      }
    }
  };

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log("oninit");
     this.loadStaffDetails();
  }



  filterRegId = [];
  staffRegidload = [];
  loadRegidName = [];
  peopleTableData: Array<any>;
  constructor(private dbService: DbService, private router: Router, private log: Logs) {
    
  }

loadStaffDetails(){
 
   this.dbService.getDataFromProc('mstStaffRecords','').subscribe((result)=>{
        
        {
          
            result.resource.forEach((item)=>{
            this.loadRegidName.push(RegistrationLoadType.fromJson(item));
            
             });
            }
            this.log.consoleLog(this.loadRegidName);
             this.source.load(this.loadRegidName);
   }); 
 
}

//   loadRegistartionDetail() {
     // var queryFilters = new URLSearchParams();
  //   queryFilters.set('fields', 'intRegistrationId,txtFirstName,txtLastName');
  //   this.dbService.query('mst_registration', '', queryFilters).subscribe((result) => {
  //     this.loadRegidName = [];
  //     var data: any = result.json();
  //     data.resource.forEach((loadRegidName) => {
  //       console.log(data)
  //       this.loadRegidName.push(RegistrationLoadType.fromJson(loadRegidName));
  //     });
  //   });
//     var queryFilters = new URLSearchParams();
//     queryFilters.set('fields', 'intRegistrationId');
//     this.dbService.query('mst_staff', '', queryFilters).subscribe((result) => {
//       this.staffRegidload = [];
//       var data: any = result.json();
//       data.resource.forEach((staffRegidload) => {
//         this.staffRegidload.push(StaffLoadType.fromJson(staffRegidload));
//         this.log.consoleLog(staffRegidload);
// });

//       this.filterRegId = [];
//      // console.log(this.loadRegidName);
//       for (let x = 0; x < this.staffRegidload.length; x++) {
//         (this.loadRegidName.filter((data) => {
//           if (this.staffRegidload[x].intRegistrationId == data.intRegistrationId) {
//             this.filterRegId.push(data);
//             return data;
//           }
//         }));
//         this.log.consoleLog(this.filterRegId);

//       }
//       this.source.load(this.filterRegId);
//     });
//   }




  onChange() {
    //console.log("CLicked ");
    console.log("123");
  }

  selected(event) {

    this.log.consoleLog(event.data);
    this.log.consoleLog(event.data.intRegistrationId);
    let tempvalue = this.router.url;
    tempvalue = tempvalue.substring(0, tempvalue.lastIndexOf('/'));
    this.router.navigate([tempvalue + '/teacher-profile-view', event.data.intRegistrationId]);




  }

}



