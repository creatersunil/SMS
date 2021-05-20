import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { DbService } from '../../../../services';
import { Logs } from '../../../../services';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Skills } from '../skills';
import { MaritalStatus } from '../marital-status';
import { OnlyNumber } from '../../../../utils';
import { Religion } from '../religion';
import { Disability } from '../disability';
import { SocialCatagory } from '../social-catagory';
import { Cities } from '../cities';
import { States } from '../master-state';
import { Country } from '../country';
import { MotherTongue } from '../motherTongue';
import { District } from '../district';
import { Taluk } from '../taluk';
import { UserType } from '../master-user-type';
import { GroupName } from '../group-name';
import { StaffTableDataType } from '../staffTableData';
import { RegitrationTableDataType } from '../registrationTableData';
import { NgUploaderOptions } from 'ngx-uploader';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'teacher-profile',
  styleUrls: ['./modals.scss'],
  templateUrl: './teacher-profile.html',
  providers: [DbService, Logs]
})
export class TeacherProfileComponent implements OnInit {
  myForm: FormGroup;
  religions = [];
  mother_Tounges = [];
  disabilities = [];
  socialCatagory = [];
  cities = [];
  m_tongue = [];
  skills = [];
  m_status = [];
  groupname = [];
  usertype = [];
  countries = [];
  states = [];
  staffTableData = [];
  registrationTableData = [];
  registration: any;
  staffData: any;
  district = [];
  taluk = [];

  @ViewChild('childModal') childModal: ModalDirective;

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  print(): void {
    let printContents, popupWin;
    //printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
           body {font-family:Arial, Sans-Serif;}
 
            #container {width:300px; margin:0 auto;}
 
            /* Nicely lines up the labels. */
            form label {display:inline-block; width:140px;}
 
            /* You could add a class to all the input boxes instead, if you like. That would be safer, and more backwards-compatible */
            form input[type="text"],
            form input[type="password"],
            form input[type="email"] {width:160px;}
 
            form .line {clear:both;}
            form .line.submit {text-align:right;}
 
          </style>
        </head>
    <body onload="window.print();window.close()">
      <div id="container">
            <form>
                <h1>Create Logon</h1>
                <div class="inline"><label for="username">Username *: </label><input type="text" id="username" /></div>
                <div class="inline"><label for="pwd">Password *: </label><input type="password" id="pwd" /></div>
                <!-- You may want to consider adding a "confirm" password box also -->
                <div class="line"><label for="surname">Surname *: </label><input type="text" id="surname" /></div>
                <div class="line"><label for="other_names">Other Names *: </label><input type="text" id="names" /></div>
                <div class="line"><label for="dob">Date of Birth *: </label><input type="text" id="dob" /></div>
                <div class="line"><label for="email">Email *: </label><input type="email" id="email" /></div>
                <!-- Valid input types: http://www.w3schools.com/html5/html5_form_input_types.asp -->
                <div class="line"><label for="tel">Telephone: </label><input type="text" id="tel" /></div>
                <div class="line"><label for="add">Address *: </label><input type="text" id="add" /></div>
                <div class="line"><label for="ptc">Post Code *: </label><input type="text" id="ptc" /></div>
                <div class="line submit"><input type="submit" value="Submit" /></div>
 
                <p>Note: Please make sure your details are correct before submitting form and that all fields marked with * are completed!.</p>
            </form>
        </div>
    </body>
      </html>`
    );
    popupWin.document.close();
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }

  belongToBPL = [
    { viewValue: 'Yes', value: true },
    { viewValue: 'No', value: false }
  ]
  Disabled = [
    { viewValue: 'Yes', value: true },
    { viewValue: 'No', value: false }
  ]
  genders = [
    { value: '1', viewValue: 'male' },
    { value: '0', viewValue: 'female' }
  ]

  private subscription;
  id: string;
  constructor(private formBuilder: FormBuilder, private dbService: DbService, private router: Router, private log: Logs, private activatedRoute: ActivatedRoute) {
    this.subscription = activatedRoute.params.subscribe(
      (param: any) => {
      this.id = param['id']
        this.log.consoleLog('id' + this.id);
      });
    this.loadStaffdata(this.id);


    this.myForm = formBuilder.group({ 
      'txtFirstName': ['', Validators.required],
      'txtMiddleName': ['', Validators.required],
      'txtLastName': ['', Validators.required],
      'txtEmailId': ['',
        [Validators.required,
        Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
        ]],
      'dtDOB': ['', Validators.required],
      'dtJoiningDate': ['', Validators.required],
      'txtFatherName': ['', Validators.required],
      //'txtFOccupation' :['', Validators.required],
      // 'txtFEducationalQualification' :['', Validators.required], 
      //  'txtMotherName' :['', Validators.required],
      //  'txtMEducationalQualification' :['', Validators.required],
      //  'txtMOccupation':['', Validators.required],
      'intGenderId': ['', Validators.required],
      'intmothertongueId': ['', Validators.required],
      'intReligionId': ['', Validators.required],
      'bloodGroup': ['', Validators.required],
      'txtAadharNumber': ['', Validators.required],
      'txtNationality': ['', Validators.required],
      //  'blBelongToBPL' :['', Validators.required],
      //   'txtBPLCardNo' :['', Validators.required],
      //   'isDisabled' :['', Validators.required],
      // 'intDisabilityId':['', Validators.required],
      //   'intSocialCategoryId':['', Validators.required],
      'txtLocality': ['', Validators.required],
      'txtTaluk': ['', Validators.required],
      'txtDistrict': ['', Validators.required],
      'intCityId': ['', Validators.required],
      'intStateId': [''],
      'txtPincode': ['', Validators.required],
      'txtPerAddress': ['', Validators.required],
      'txtTempAddress': ['', Validators.required],
      //'user_type':['1'],
      'group_name': [''],
      'txtMobileNumber': ['', Validators.required],
      'txtRelativeNumber': ['', Validators.required],
      'txtAlternateMobileNumber': ['', Validators.required],
      'intMaritalStatusId': ['', Validators.required],
      'qualification': ['', Validators.required],
      'designation': ['', Validators.required],
      'skillId': ['', Validators.required],
      'txtPreviousSchoolName': ['', Validators.required],
      'txtPreviousSchoolAddress': ['', Validators.required],
      //  'subjects' :['', Validators.required],
      //'experience' :['', Validators.required],
      //'blImage':['']

    });


  }


  bindRegistrationFormValues() {
    (<FormControl>this.myForm.controls['txtFirstName'])
      .setValue(this.registration.txtFirstName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtMiddleName'])
      .setValue(this.registration.txtMiddleName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtLastName'])
      .setValue(this.registration.txtLastName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtEmailId'])
      .setValue(this.registration.txtEmailId, { onlySelf: true });
    (<FormControl>this.myForm.controls['dtDOB'])
      .setValue(this.registration.dtDOB, { onlySelf: true });
    (<FormControl>this.myForm.controls['dtJoiningDate'])
      .setValue(this.registration.dtJoiningDate, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFatherName'])
      .setValue(this.registration.txtFatherName, { onlySelf: true });
    (<FormControl>this.myForm.controls['intGenderId'])
      .setValue(this.registration.intGenderId, { onlySelf: true });
    (<FormControl>this.myForm.controls['intmothertongueId'])
      .setValue(this.registration.intmothertongueId, { onlySelf: true });
    (<FormControl>this.myForm.controls['intReligionId'])
      .setValue(this.registration.intReligionId, { onlySelf: true });
    (<FormControl>this.myForm.controls['bloodGroup'])
      .setValue(this.registration.bloodGroup, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtAadharNumber'])
      .setValue(this.registration.txtAadharNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtNationality'])
      .setValue(this.registration.txtNationality, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtLocality'])
      .setValue(this.registration.txtLocality, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtTaluk'])
      .setValue(this.registration.txtTaluk, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtDistrict'])
      .setValue(this.registration.txtDistrict, { onlySelf: true });
    (<FormControl>this.myForm.controls['intStateId'])
      .setValue(this.registration.intStateId, { onlySelf: true });
    (<FormControl>this.myForm.controls['intCityId'])
      .setValue(this.registration.intCityId, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtPincode'])
      .setValue(this.registration.txtPincode, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtPerAddress'])
      .setValue(this.registration.txtPerAddress, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtTempAddress'])
      .setValue(this.registration.txtTempAddress, { onlySelf: true });
    (<FormControl>this.myForm.controls['group_name'])
      .setValue(this.registration.group_name, { onlySelf: true });
  }

  bindTeacherFormValues() {

    (<FormControl>this.myForm.controls['txtMobileNumber'])
      .setValue(this.staffData.txtMobileNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtRelativeNumber'])
      .setValue(this.staffData.txtRelativeNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtAlternateMobileNumber'])
      .setValue(this.staffData.txtAlternateMobileNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['intMaritalStatusId'])
      .setValue(this.staffData.intMaritalStatusId, { onlySelf: true });
    (<FormControl>this.myForm.controls['qualification'])
      .setValue(this.staffData.qualification, { onlySelf: true });
    (<FormControl>this.myForm.controls['designation'])
      .setValue(this.staffData.designation, { onlySelf: true });
    (<FormControl>this.myForm.controls['skillId'])
      .setValue(this.staffData.skillId, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtPreviousSchoolName'])
      .setValue(this.staffData.txtPreviousSchoolName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtPreviousSchoolAddress'])
      .setValue(this.staffData.txtPreviousSchoolAddress, { onlySelf: true });
    //  (<FormControl>this.myForm.controls['subjects'])
    //  .setValue(this.staffData.subjects, { onlySelf: true });
    //  (<FormControl>this.myForm.controls['experience'])
    //  .setValue(this.staffData.experience, { onlySelf: true });


  }


  onSubmit(dialog) {
    this.updateRegistrationTable(dialog);
    this.updateStaffTable(dialog);

  }


  updateRegistrationTable(dialog) {
    this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + this.id);
    this.dbService.update('mst_registration', this.myForm.getRawValue(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);
      dialog.show();
    });

  }

  updateStaffTable(dialog) {

    this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + this.id);

    this.dbService.update('mst_staff', this.myForm.getRawValue(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);
      dialog.show();
    });

  }


  ProfilePage() {
    let tempvalue = this.router.url;
    tempvalue = tempvalue.substring(0, tempvalue.lastIndexOf('/'));
    this.log.consoleLog(tempvalue);
    let lastvalue = tempvalue.substring(0, tempvalue.lastIndexOf('/'));
    this.log.consoleLog(lastvalue);
    this.router.navigate([lastvalue + '/teachers-records-view']);

  }

  loadStaffdata(registration_id) {
    this.log.consoleLog('registration_id ' + registration_id);
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + registration_id);
    this.dbService.query('mst_staff', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((staffTableData) => {
        this.staffData = StaffTableDataType.fromJson(staffTableData);
        this.log.consoleLog(this.staffData);
      });
      this.bindTeacherFormValues();
    });

    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + registration_id);
    this.dbService.query('mst_registration', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((registrationTableData) => {
        this.registration = RegitrationTableDataType.fromJson(registrationTableData);
        this.log.consoleLog(this.registration);
      });
      this.bindRegistrationFormValues();
    })
  }




  loadData() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'skillId,skill_name');
    this.dbService.query('mst_skills', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((skills) => {
        this.skills.push(Skills.fromJson(skills));
        this.log.consoleLog(this.skills.length);
      });
      this.log.consoleLog(data);
    })

    //marital status data
    queryFilters.set('fields', 'intMaritalStatusId,txtMaritalStatus');
    this.dbService.query('mstmaritalstatus', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((m_status) => {
        this.m_status.push(MaritalStatus.fromJson(m_status));
        this.log.consoleLog(this.m_status.length);
      });
      this.log.consoleLog(data);
    });

    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'intReligionId,txtReligionName');
    this.dbService.query('mstreligion', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((religions) => {
        this.religions.push(Religion.fromJson(religions));
        this.log.consoleLog(this.religions.length);
      });
      this.log.consoleLog(data);
    })

    queryFilters.set('fields', 'txtStateName,intStateId,intCountryId');
    this.dbService.query('mststate', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((states) => {
        this.states.push(States.fromJson(states));
        this.log.consoleLog(this.states.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'intCityId,txtCityName');
    this.dbService.query('mstcity', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((cities) => {
        this.cities.push(Cities.fromJson(cities));
        this.log.consoleLog(this.cities.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'intCountryId,txtCountryName');
    this.dbService.query('mstcountry', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((countries) => {
        this.countries.push(Country.fromJson(countries));
        this.log.consoleLog(this.countries.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'intmothertongueId,txtmothertongue');
    this.dbService.query('mstmothertongue', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((m_tongue) => {
        this.m_tongue.push(MotherTongue.fromJson(m_tongue));
        this.log.consoleLog(this.m_tongue.length);
      });
      this.log.consoleLog(data);
    })

    queryFilters.set('fields', 'intDistrictId,txtDistrictName,intStateId');
    this.dbService.query('mstdistrict', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((district) => {
        this.district.push(District.fromJson(district));
        this.log.consoleLog(this.district.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'intTalukId,txtTalukName,intDistrictId');
    this.dbService.query('msttaluk', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((taluk) => {
        this.taluk.push(Taluk.fromJson(taluk));
        this.log.consoleLog(this.taluk.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'type_id,user_type');
    this.dbService.query('mst_user_type', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((usertype) => {
        this.usertype.push(UserType.fromJson(usertype));
        this.log.consoleLog(this.usertype.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'id,group_name');
    this.dbService.query('cfg_group_default_views', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((groupname) => {
        this.groupname.push(GroupName.fromJson(groupname));
        this.log.consoleLog(this.groupname.length);
      });
      this.log.consoleLog(data);
    });

  }


  /**
   * Error message for user group
   */
  userGroup = false;
  groupNameValidation(groupvalue) {
    this.log.consoleLog(groupvalue);
    if (groupvalue.toUpperCase() == 'STUDENT') {

      this.userGroup = true;
      (<FormControl>this.myForm.controls['group_name'])
        .setValue(0, { onlySelf: true });

    }
    else {

      this.userGroup = false;
    }
  }



  /**
   * Auto display of district and state and country by selecting taluk
   */

  selectedDistrict: any;
  selectedState: any;
  selectedCountry: any;
  onSelectTaluk(talukId) {
    this.log.consoleLog(talukId);

    this.taluk.filter((data) => {
      if (data.intTalukId == talukId) {
        this.selectedDistrict = data.intDistrictId;
        this.log.consoleLog(this.selectedDistrict);
        (<FormControl>this.myForm.controls['txtDistrict'])
          .setValue(this.selectedDistrict, { onlySelf: true });
      }
    });


    this.district.filter((districtdata) => {
      if (districtdata.intDistrictId == this.selectedDistrict) {
        this.selectedState = districtdata.intStateId;
        this.log.consoleLog("stateid " + this.selectedState);
        (<FormControl>this.myForm.controls['intStateId'])
          .setValue(this.selectedState, { onlySelf: true });
      }
    });


    this.states.filter((ststedata) => {
      if (ststedata.intStateId == this.selectedState) {
        this.selectedCountry = ststedata.intCountryId;
        this.log.consoleLog("country " + this.selectedCountry);
        (<FormControl>this.myForm.controls['txtNationality'])
          .setValue(this.selectedCountry, { onlySelf: true });
      }
    });

  }


}