import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ClassLoadType } from './classdataload';
import { RegistrationLoadType } from './registrationtableload';
import { StudentLoadType } from './studentTableLoad';

import { DbService } from '../../../../services';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import 'style-loader!./students-records-view.scss';
import { Logs } from '../../../../services';



@Component({
  selector: 'button-view',
  template: `
      <button  class="btn btn-primary btn-xs btn-with-icon" type="button">
    <i class="ion-edit"></i>Edit</button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
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
  selector: 'students-records-view',
  templateUrl: './students-records-view.html',
  providers: [DbService, Logs]
})

export class StudentsRecordsView implements OnInit {

  absent: boolean = false;

  source = new LocalDataSource();


  settings = {
    actions: {
      delete: false,
      add: false,
      edit: false
    },
    columns: {

      intRegistrationId: {
        title: 'Registration ID'
      },
      txtFirstName: {
        title: 'Student Name'
      },
      button: {
        title: 'Action',
        type: 'custom',
        renderComponent: ButtonViewComponent,
      }
    }
  };

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
    this.loadRegistartionDetail();
  }

  query: string = '';
  constructor(private dbService: DbService, private router: Router, private log: Logs) {

  }



  classDataLoad = [];

  loadData() {

    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'class_id,class_name');
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      this.classDataLoad = [];
      var data: any = result.json();
      data.resource.forEach((classDataLoad) => {
        this.classDataLoad.push(ClassLoadType.fromJson(classDataLoad));
        this.log.consoleLog(this.classDataLoad.length);
      });
      this.log.consoleLog(this.classDataLoad);
      //this.source.load(this.classDataLoad);



    }
    )
  }

  loadRegidName = [];
  loadRegistartionDetail() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'intRegistrationId,txtFirstName, txtLastName');
    this.dbService.query('mst_registration', '', queryFilters).subscribe((result) => {
      this.loadRegidName = [];
      var data: any = result.json();
      data.resource.forEach((loadRegidName) => {
        this.loadRegidName.push(RegistrationLoadType.fromJson(loadRegidName));
      });
    });
  }


  filterRegId = [];
  studentRegidload = [];
  selectedclass_id: any;
  peopleTableData: Array<any>;
  onselect(class_id) {
    this.selectedclass_id = class_id;
    var queryFilters = new URLSearchParams();

    queryFilters.set('filter', 'intClassId= ' + class_id);
    queryFilters.set('fields', 'intRegistrationId');
    this.dbService.query('mst_student', '', queryFilters).subscribe((result) => {
      this.studentRegidload = [];
      var data: any = result.json();
      data.resource.forEach((studentRegidload) => {
        this.studentRegidload.push(StudentLoadType.fromJson(studentRegidload));
        this.log.consoleLog(studentRegidload);


      });
      this.filterRegId = [];
      this.log.consoleLog("filter sections");
      for (let x = 0; x < this.studentRegidload.length; x++) {
        (this.loadRegidName.filter((data) => {
          if (this.studentRegidload[x].intRegistrationId == data.intRegistrationId) {
            this.filterRegId.push(data);
            return data;
          }
        }));
        this.log.consoleLog(this.filterRegId);

      }
      this.source.load(this.filterRegId);
    });
  }




  regId: any;
  selected(event) {
    this.regId = event.data.intRegistrationId;
    this.log.consoleLog(event.data);
    this.log.consoleLog(event.data.intRegistrationId);
    let tempvalue = this.router.url;
    tempvalue = tempvalue.substring(0, tempvalue.lastIndexOf('/'));
    this.router.navigate([tempvalue + '/student-profile-view', event.data.intRegistrationId]);
  }

}



