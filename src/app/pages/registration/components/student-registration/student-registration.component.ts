import { Component, OnInit, ViewChild } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Classes } from '../classes';
import { Sections } from '../section';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { DbService } from '../../../../services';
import { Religion } from '../religion';
import { Disability } from '../disability';
import { SocialCatagory } from '../social-catagory';
import { Cities } from '../cities';
import { MotherTongue } from '../motherTongue';
import { UserType } from '../master-user-type';
import { Skills } from '../skills';
import { MaritalStatus } from '../marital-status';
import { Country } from '../country';
import { GroupName } from '../group-name';
import { Streams } from '../streams';
import { District } from '../district';
import { States } from '../master-state';
import { Taluk } from '../taluk';
import { Affiliation } from '../affiliation';
import { Logs, UserConfig } from '../../../../services';
import { OnlyNumber } from '../.././numberonly.directive';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'student-registration',
  templateUrl: './student-registration.html',
  providers: [DbService, Logs, UserConfig]
})
export class StudentRegistrationComponent implements OnInit {
  myForm: FormGroup;
  religions = [];
  mother_Tounges = [];
  disabilities = [];
  socialCatagory = [];
  cities = [];
  groupname = [];
  m_tongue = [];
  usertype = [];
  classes = [];
  countries = [];
  sections = [];
  streams = [];
  affiliations = [];
  district = [];
  taluk = [];
  states = [];
  date: number;
  loggedId: any;

  @ViewChild('childModal') childModal: ModalDirective;

  showChildModal(): void {
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }

  belongToBPL = [
    { value: '1', viewValue: 'Yes' },
    { value: '0', viewValue: 'No' }
  ]
  Disabled = [
    { value: '1', viewValue: 'Yes' },
    { value: '0', viewValue: 'No' }
  ]
  genders = [
    { value: '1', viewValue: 'male' },
    { value: '0', viewValue: 'female' }
  ];

  public txtFirstName: AbstractControl;
  public txtLastName: AbstractControl;
  public display_name: AbstractControl;
  public txtEmailId: AbstractControl;
  public password: AbstractControl;
  public txtMiddleName: AbstractControl;
  public dtDOB: AbstractControl;
  // public dtJoiningDate:AbstractControl;
  public txtFatherName: AbstractControl;
  public txtFOccupation: AbstractControl;
  public txtFEducationalQualification: AbstractControl;
  public txtMotherName: AbstractControl;
  public txtMEducationalQualification: AbstractControl;
  public txtMOccupation: AbstractControl;
  public intGenderId: AbstractControl;
  public intmothertongueId: AbstractControl;
  public intReligionId: AbstractControl;
  public bloodGroup: AbstractControl;
  public txtAadharNumber: AbstractControl;
  public txtNationality: AbstractControl;
  public blBelongToBPL: AbstractControl;
  public txtBPLCardNo: AbstractControl;
  public disability: AbstractControl;
  public intDisabilityId: AbstractControl;
  public intSocialCategoryId: AbstractControl;
  public txtLocality: AbstractControl;
  public txtTaluk: AbstractControl;
  public txtDistrict: AbstractControl;
  public intStateId: AbstractControl;
  public user_type: AbstractControl;
  public intCityId: AbstractControl;
  public txtPincode: AbstractControl;
  public txtPerAddress: AbstractControl;
  public txtTempAddress: AbstractControl;
  public userLoginId: AbstractControl;
  public group_name: AbstractControl;


  public intClassId: AbstractControl;
  public intAffiliationId: AbstractControl;
  public intStreamId: AbstractControl;
  public intSectionId: AbstractControl;
  public nmParentsAnnualIncome: AbstractControl;
  public txtStudentCaste: AbstractControl;
  public txtStudentCasteCertificateNo: AbstractControl;
  public txtPreviousSchoolName: AbstractControl;
  public txtPreviousSchoolAddress: AbstractControl;
  public txtTransferCertificateNo: AbstractControl;
  public dtTransferCertificateDate: AbstractControl;
  public txtFathersCasteCertificateNo: AbstractControl;
  public txtFathersCaste: AbstractControl;
  public txtMothersCaste: AbstractControl;
  public txtFMobileNumber: AbstractControl;
  public txtMothersCasteCertificateNo: AbstractControl;
  public txtFOtherNumber: AbstractControl;
  public txtMMobileNumber: AbstractControl;
  public txtMOtherNumber: AbstractControl;
  public dtAdmissionDate: AbstractControl;
  public txtStudentEnrollmentNumber: AbstractControl;
  public fatherAadharNo: AbstractControl;
  public motherAadharNo: AbstractControl;

  public submitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) {
    this.myForm = formBuilder.group({
      'txtFirstName': ['', Validators.compose([Validators.required])],
      'txtMiddleName': ['', Validators.required],
      'txtLastName': ['', Validators.compose([Validators.required])],
      'txtEmailId': ['',
        Validators.compose([Validators.required,
        Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
        ])],
      'dtDOB': ['', Validators.required],
      'dtJoiningDate': ['', Validators.required],
      'txtFatherName': ['', Validators.required],
      'txtFOccupation': ['', Validators.required],
      'txtFEducationalQualification': ['', Validators.required],
      'txtMotherName': ['', Validators.required],
      'txtMEducationalQualification': [''],
      'txtMOccupation': [''],
      'intGenderId': ['1'],
      'intmothertongueId': [''],
      'intReligionId': ['', Validators.required],
      'bloodGroup': ['',],
      'txtAadharNumber': ['', Validators.required],
      'txtNationality': ['', Validators.required],
      'blBelongToBPL': [''],
      'txtBPLCardNo': [''],
      'isDisabled': [''],
      'intDisabilityId': [''],
      'intSocialCategoryId': [''],
      'txtLocality': ['', Validators.required],
      'txtTaluk': ['', Validators.required],
      'txtDistrict': ['', Validators.required],
      'intStateId': [''],
      'user_type': ['2', Validators.required],
      'intCityId': [''],
      'txtPincode': ['', Validators.required],
      'txtPerAddress': ['', Validators.required],
      'txtTempAddress': [''],
      'loginId': [''],
      'group_name': ['Student'],

      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],


      'intRegistrationId': [''],
      'intClassId': [''],
      'intAffiliationId': ['1'],
      'intStreamId': [''],
      'intSectionId': [''],
      'nmParentsAnnualIncome': [''],
      'txtStudentCaste': [''],
      'txtStudentCasteCertificateNo': [''],
      'txtPreviousSchoolName': [''],
      'txtPreviousSchoolAddress': [''],
      'txtTransferCertificateNo': [''],
      'dtTransferCertificateDate': [''],
      'txtFathersCasteCertificateNo': [''],
      'txtFathersCaste': [''],
      // 'fatherEducation' :[''],
      'txtMothersCaste': ['', Validators.required],
      'txtMothersCasteCertificateNo': ['', Validators.required],
      'txtFOtherNumber': ['', Validators.required],
      'txtFMobileNumber': ['', Validators.required],
      'txtMMobileNumber': ['', Validators.required],
      'txtMOtherNumber': ['', Validators.required],
      'dtAdmissionDate': ['', Validators.required],
      'txtStudentEnrollmentNumber': ['', Validators.required],
      'fatherAadharNo': [''],
      'motherAadharNo': ['']
    });
    this.txtFirstName = this.myForm.controls['txtFirstName'];
    this.txtLastName = this.myForm.controls['txtLastName'];
    this.txtMiddleName = this.myForm.controls['txtMiddleName'];
    this.txtEmailId = this.myForm.controls['txtEmailId'];
    this.password = this.myForm.controls['password'];
    this.dtDOB = this.myForm.controls['dtDOB'];
    //   this.dtJoiningDate =this.myForm.controls['dtJoiningDate'];
    this.txtFatherName = this.myForm.controls['txtFatherName'];
    this.txtFOccupation = this.myForm.controls['txtFOccupation'];
    this.txtFEducationalQualification = this.myForm.controls['txtFEducationalQualification'];
    this.txtMotherName = this.myForm.controls['txtMotherName'];
    this.txtMEducationalQualification = this.myForm.controls['txtMEducationalQualification'];
    this.txtMOccupation = this.myForm.controls['txtMOccupation'];
    this.intGenderId = this.myForm.controls['intGenderId'];
    this.intmothertongueId = this.myForm.controls['intmothertongueId'];
    this.intReligionId = this.myForm.controls['intReligionId'];
    this.bloodGroup = this.myForm.controls['bloodGroup'];
    this.txtAadharNumber = this.myForm.controls['txtAadharNumber'];
    this.txtNationality = this.myForm.controls['txtNationality'];
    this.blBelongToBPL = this.myForm.controls['blBelongToBPL'];
    this.txtBPLCardNo = this.myForm.controls['txtBPLCardNo'];
    this.disability = this.myForm.controls['isDisabled'];
    this.intDisabilityId = this.myForm.controls['intDisabilityId'];
    this.intSocialCategoryId = this.myForm.controls['intSocialCategoryId'];
    this.txtLocality = this.myForm.controls['txtLocality'];
    this.txtTaluk = this.myForm.controls['txtTaluk'];
    this.txtDistrict = this.myForm.controls['txtDistrict'];
    this.intStateId = this.myForm.controls['intStateId'];
    this.user_type = this.myForm.controls['user_type'];
    this.intCityId = this.myForm.controls['intCityId'];
    this.txtPincode = this.myForm.controls['txtPincode'];
    this.txtPerAddress = this.myForm.controls['txtPerAddress'];
    this.txtTempAddress = this.myForm.controls['txtTempAddress'];
    this.group_name = this.myForm.controls['group_name'];
    this.userLoginId = this.myForm.controls['loginId'];


    this.intClassId = this.myForm.controls['intClassId'];
    this.intAffiliationId = this.myForm.controls['intAffiliationId'];
    this.intStreamId = this.myForm.controls['intStreamId'];
    this.intSectionId = this.myForm.controls['intSectionId'];
    this.nmParentsAnnualIncome = this.myForm.controls['nmParentsAnnualIncome'];
    this.txtStudentCaste = this.myForm.controls['txtStudentCaste'];
    this.txtPreviousSchoolName = this.myForm.controls['txtPreviousSchoolName'];
    this.txtPreviousSchoolAddress = this.myForm.controls['txtPreviousSchoolAddress'];
    this.txtStudentCasteCertificateNo = this.myForm.controls['txtStudentCasteCertificateNo'];
    this.txtTransferCertificateNo = this.myForm.controls['txtTransferCertificateNo'];
    this.dtTransferCertificateDate = this.myForm.controls['dtTransferCertificateDate'];
    this.txtFathersCasteCertificateNo = this.myForm.controls['txtFathersCasteCertificateNo'];
    this.txtFathersCaste = this.myForm.controls['txtFathersCaste'];
    this.txtMothersCaste = this.myForm.controls['txtMothersCaste'];
    this.txtFMobileNumber = this.myForm.controls['txtFMobileNumber'];
    this.txtMothersCasteCertificateNo = this.myForm.controls['txtMothersCasteCertificateNo'];
    this.txtFOtherNumber = this.myForm.controls['txtFOtherNumber'];
    this.txtMMobileNumber = this.myForm.controls['txtMMobileNumber'];
    this.txtMOtherNumber = this.myForm.controls['txtMOtherNumber'];
    this.dtAdmissionDate = this.myForm.controls['dtAdmissionDate'];
    this.txtStudentEnrollmentNumber = this.myForm.controls['txtStudentEnrollmentNumber'];
    this.fatherAadharNo = this.myForm.controls['fatherAadharNo'],
      this.motherAadharNo = this.myForm.controls['motherAadharNo'],

      (<FormControl>this.myForm.controls['password'])
        .setValue(this.generatePassword(), { onlySelf: true });

  }
  //End of Constructor

  toJson(stringify?: boolean): any {
    var doc = {
      email: this.txtEmailId.value,
      first_name: this.txtFirstName.value,
      last_name: this.txtLastName.value,
      display_name: this.txtFirstName.value + " " + this.txtLastName.value,
      new_password: this.password.value,
      code: "work",
      school_id: this.userConfig.getSchoolId(),
      school_code: this.userConfig.getSchoolCode(),
      phone: this.txtFMobileNumber.value,
      // security_question:"school_name",
      //  security_answer:this.userConfig.getSchoolCode()
    };

    this.log.consoleLog(" Sending " + JSON.stringify(doc));
    return stringify ? JSON.stringify(doc) : doc;
  }


  /**
   * Bind data to School_org user_school table
   */

  schoolOrg(): any {
    var doc = {
      user_email: this.txtEmailId.value,
      school_id: this.userConfig.getSchoolId(),
      school_code: this.userConfig.getSchoolCode()
    }
    return doc;
  }

  /**
   * Bind email id to login id
   */
  loginId: any;
  checkEmail(email) {
    this.log.consoleLog(email.value);
    this.loginId = email.value;
    (<FormControl>this.myForm.controls['loginId'])
      .setValue(this.loginId, { onlySelf: true });
  }



  onSubmit(dialog) {
      this.submitted = true;

      this.dbService.register(this.toJson(true)).subscribe((response) => {
      this.log.consoleLog("after reg")
      this.log.consoleLog(response);
      this.log.consoleLog("Step1")
      this.log.consoleLog(response.status);
      if (response.status == 200 && response.statusText == "OK") {
        this.log.consoleLog("success");
        this.insert(dialog);

        this.dbService.insertUserToSchool(this.schoolOrg()).subscribe((data) => {
          //this.log.consoleLog('school data');
          this.log.consoleLog(data);
        });
      }
      else if (response.status == 400 && response.statusText == "Bad Request") {
        this.log.consoleLog("already mail id exists");
      }
    });
  }


  loadData() {

    this.loggedId = this.userConfig.getRegId();
    this.dbService.getDateTime('getDate').subscribe((date) => {
      this.date = date;
      this.log.consoleLog(this.date);
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
    });

    queryFilters.set('fields', 'intDisabilityChildId,txtDisability');
    this.dbService.query('mstdisabilitychild', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((disabilities) => {
        this.disabilities.push(Disability.fromJson(disabilities));
        this.log.consoleLog(this.disabilities.length);
      });
      this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'intSocialCategoryId,txtSocialCategory');
    this.dbService.query('mstsocialcategory', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((socialCatagory) => {
        this.socialCatagory.push(SocialCatagory.fromJson(socialCatagory));
        this.log.consoleLog(this.socialCatagory.length);
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



    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'class_id,class_name');
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
        //this.log.consoleLog(this.classes.length);
      });
      // this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'section_id,section_name');
    this.dbService.query('mst_sections', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((sections) => {
        this.sections.push(Sections.fromJson(sections));
      });
      //this.log.consoleLog(data);
    });

    queryFilters.set('fields', 'intStreamId,txtStream');
    this.dbService.query('mststream', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((streams) => {
        this.streams.push(Streams.fromJson(streams));
        this.log.consoleLog(this.streams.length);
      });
      this.log.consoleLog(data);
    })

    queryFilters.set('fields', 'intAffiliationId,txtAffiliation');
    this.dbService.query('mstaffiliation', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((affiliations) => {
        this.affiliations.push(Affiliation.fromJson(affiliations));
        this.log.consoleLog(this.affiliations.length);
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

    queryFilters.set('fields', 'txtStateName,intStateId,intCountryId');
    this.dbService.query('mststate', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((states) => {
        this.states.push(States.fromJson(states));
        this.log.consoleLog(this.states.length);
      });
      this.log.consoleLog(data);
    });

  }




  //Disable BPL card Number If Not BPL crad holder
  disabletable = true;
  disableCardNumber(cardValue) {
    this.log.consoleLog(cardValue);
    if (cardValue == 1) {
      this.disabletable = true;
    }
    else {
      this.disabletable = false;
    }
  }

  //Disable IsDisabld Textfield if not disabled
  isDisabled = true;
  onClickeDisabled(disValue) {
    if (disValue == 1) {
      this.isDisabled = true;
    }
    else {
      this.isDisabled = false;
    }
  }


  /**
   * Bind Type of user i.e Staff or student
   */
  selectedUserType: any;
  onSelectUserType(id) {
    this.selectedUserType = id;
    this.log.consoleLog(this.selectedUserType);
  }

  /**
   * Insert Data to database
   */
  registrationId: any;
  insert(dialog) {

    this.log.consoleLog(this.generalInsertDoc());
    this.dbService.insert('mst_registration', this.generalInsertDoc()).subscribe((data) => {
      this.log.consoleLog(data);
      let tempvalue = this.router.url;
      tempvalue = tempvalue.substring(0, tempvalue.lastIndexOf('/'));
      this.log.consoleLog(data.resource[0].intRegistrationId);
      this.registrationId = (data.resource[0].intRegistrationId);
      //this.staffInsertDoc();
      this.log.consoleLog(this.studentInsertDoc());
      this.dbService.insert('mst_student', this.studentInsertDoc()).subscribe((response) => {
        this.log.consoleLog(response);
        dialog.show();
      });
      this.dbService.insert("map_student_cs", this.insertStudentRecordsCsDoc()).subscribe((data) => {
        this.log.consoleLog(data);
      });
      this.myForm.reset();

    });

  }




  generatePassword(): any {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }




  generalInsertDoc() {

    var doc = {
      txtFirstName: this.txtFirstName.value,
      txtLastName: this.txtLastName.value,
      txtMiddleName: this.txtMiddleName.value,
      txtEmailId: this.txtEmailId.value,
      //password      :
      dtDOB: this.dtDOB.value,
      //dtJoiningDate :this.dtJoiningDate.value,
      txtFatherName: this.txtFatherName.value,
      txtFOccupation: this.txtFOccupation.value,
      txtFEducationalQualification: this.txtFEducationalQualification.value,
      txtMotherName: this.txtMotherName.value,
      txtMEducationalQualification: this.txtMEducationalQualification.value,
      //  txtMEducationalQualification
      txtMOccupation: this.txtMOccupation.value,
      intGenderId: this.intGenderId.value,
      intmothertongueId: this.intmothertongueId.value,
      intReligionId: this.intReligionId.value,
      bloodGroup: this.bloodGroup.value,
      txtAadharNumber: this.txtAadharNumber.value,
      txtNationality: this.txtNationality.value,
      blBelongToBPL: this.blBelongToBPL.value,
      txtBPLCardNo: this.txtBPLCardNo.value,
      isDisabled: this.disability.value,
      intDisabilityId: this.intDisabilityId.value,
      intSocialCategoryId: this.intSocialCategoryId.value,
      txtLocality: this.txtLocality.value,
      txtTaluk: this.txtTaluk.value,
      txtDistrict: this.txtDistrict.value,
      intStateId: this.intStateId.value,
      user_type: this.user_type.value,
      intCityId: this.intCityId.value,
      txtPincode: this.txtPincode.value,
      txtPerAddress: this.txtPerAddress.value,
      txtTempAddress: this.txtTempAddress.value,
      group_name: this.group_name.value,
      loginId: this.userLoginId.value
    }
    return doc;
  }

  studentInsertDoc() {
    var doc = {
      intClassId: this.intClassId.value,
      intAffiliationId: this.intAffiliationId.value,
      intStreamId: this.intStreamId.value,
      intSectionId: this.intSectionId.value,
      nmParentsAnnualIncome: this.nmParentsAnnualIncome.value,
      txtStudentCaste: this.txtStudentCaste.value,
      txtPreviousSchoolName: this.txtPreviousSchoolName.value,
      txtPreviousSchoolAddress: this.txtPreviousSchoolAddress.value,
      txtStudentCasteCertificateNo: this.txtStudentCasteCertificateNo.value,
      txtTransferCertificateNo: this.txtTransferCertificateNo.value,
      dtTransferCertificateDate: this.dtTransferCertificateDate.value,
      txtFathersCasteCertificateNo: this.txtFathersCasteCertificateNo.value,
      txtFathersCaste: this.txtFathersCaste.value,
      txtMothersCaste: this.txtMothersCaste.value,
      txtFMobileNumber: this.txtFMobileNumber.value,
      txtMothersCasteCertificateNo: this.txtMothersCasteCertificateNo.value,
      txtFOtherNumber: this.txtFOtherNumber.value,
      txtMMobileNumber: this.txtMMobileNumber.value,
      txtMOtherNumber: this.txtMOtherNumber.value,
      dtAdmissionDate: this.dtAdmissionDate.value,
      txtStudentEnrollmentNumber: this.txtStudentEnrollmentNumber.value,
      intRegistrationId: this.registrationId,
      fatherAadharNo: this.fatherAadharNo.value,
      motherAadharNo: this.motherAadharNo.value
    }
    return doc;
  }


  insertStudentRecordsCsDoc() {
    var doc = {
      registration_id: this.registrationId,
      class_id: this.intClassId.value,
      section_id: this.intSectionId.value,
      year: this.date,
      created_by: this.loggedId
    }
    return doc;
  }


  userGroup = false;
  groupNameValidation(groupvalue) {
    this.log.consoleLog(groupvalue);
    if (groupvalue.toUpperCase() == 'STUDENT') {

      this.userGroup = false;


    }
    else {
      (<FormControl>this.myForm.controls['group_name'])
        .setValue(0, { onlySelf: true });
      this.userGroup = true;
    }
  }



  selectedDistrict: any;
  selectedState: any;
  selectedCountry: any;
  onSelectTaluk(talukId) {
    this.log.consoleLog(talukId);

    this.taluk.filter((data) => {
      if (data.intTalukId == talukId) {
        this.selectedDistrict = data.intDistrictId;
        this.log.consoleLog('dist ' + this.selectedDistrict);
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