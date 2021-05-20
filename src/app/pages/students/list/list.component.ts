
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subscription } from 'rxjs/Subscription';
import { SnotifyService, SnotifyConfig } from 'ng-snotify';
/// Classes
import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { UtilsService } from './../../../utils/utils.service';
import { Classes } from '../../../services';
import { Sections } from '../../../services';
import { StudentsWrtClassSection } from './studentsdetailsWrtClassSection';
import { RegitrationTableDataType } from './registrationTableData';
import { StudentTableDataType } from './studentTableData';
import { Religion } from "./religion";
import { Disability } from './disability';
import { SocialCatagory } from './social-catagory';
import { MotherTongue } from './motherTongue';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss', '../students.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService]
})
export class ListComponent implements OnInit {
  myForm: FormGroup;
  public religions: any[] = new Array<Religion>();
  public disabilities: any[] = new Array<Disability>();
  public classes: any[] = new Array<Classes>();
  public sections: any[] = new Array<Sections>();
  public socialCatagory: any[] = new Array<SocialCatagory>();
  public m_tongue: any[] = new Array<MotherTongue>();
  public sectionNames: any[] = new Array<Sections>();
  public studentDetails: any[] = new Array<StudentsWrtClassSection>();
  public belongToBPL: any[] = this.utilService.belongToBPL;
  public Disabled: any[] = this.utilService.Disabled;
  public genders: any[] = this.utilService.genders;
  public mediumOfInstruction: any[] = this.utilService.mediumOfInstruction;

  public selectedClassId: number = 1;
  public selectedClass: string;
  public selectedSectionId: number = 1;
  public selectedsection: string;
  public loggedId: any;
  public disableListOnclickStudent: boolean = false;

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


  constructor(private formBuilder: FormBuilder, private utilService: UtilsService, private notify: SnotifyService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) {
    this.myForm = formBuilder.group({
      'txtFirstName': ['', Validators.compose([Validators.required])],
      'txtMiddleName': [''],
      'txtLastName': [''],
      'txtEmailId': ['',
        Validators.compose([Validators.required,
        Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
        ])],
      'dtDOB': ['', Validators.required],
      // 'dtJoiningDate': [''],
      'txtFatherName': ['', Validators.required],
      'txtFOccupation': [''],
      'txtFEducationalQualification': [''],
      'txtMotherName': [''],
      'txtMEducationalQualification': [''],
      'txtMOccupation': [''],
      'intGenderId': ['1'],
      'intmothertongueId': [''],
      'intReligionId': [''],
      'bloodGroup': ['',],
      'txtAadharNumber': [''],
      'txtNationality': [''],
      'blBelongToBPL': [''],
      'txtBPLCardNo': [''],
      'isDisabled': [''],
      'intDisabilityId': [''],
      'intSocialCategoryId': [''],
      'txtLocality': [''],
      'txtTaluk': [''],
      'txtDistrict': [''],
      'intStateId': [''],
      'user_type': ['2'],
      'intCityId': [''],
      'txtPincode': [''],
      'txtPerAddress': [''],
      'txtTempAddress': [''],
      'loginId': [''],
      'group_name': ['Student'],

      // 'password': [''],


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
      'txtMothersCaste': [''],
      'txtMothersCasteCertificateNo': [''],
      'txtFOtherNumber': [''],
      'txtFMobileNumber': ['', Validators.required],
      'txtMMobileNumber': [''],
      'txtMOtherNumber': [''],
      'dtAdmissionDate': [''],
      'txtStudentEnrollmentNumber': [''],
      'fatherAadharNo': [''],
      'motherAadharNo': ['']
    });
    this.txtFirstName = this.myForm.controls['txtFirstName'];
    this.txtLastName = this.myForm.controls['txtLastName'];
    this.txtMiddleName = this.myForm.controls['txtMiddleName'];
    this.txtEmailId = this.myForm.controls['txtEmailId'];
    // this.password = this.myForm.controls['password'];
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
    // this.txtNationality = this.myForm.controls['txtNationality'];
    this.blBelongToBPL = this.myForm.controls['blBelongToBPL'];
    this.txtBPLCardNo = this.myForm.controls['txtBPLCardNo'];
    this.disability = this.myForm.controls['isDisabled'];
    this.intDisabilityId = this.myForm.controls['intDisabilityId'];
    this.intSocialCategoryId = this.myForm.controls['intSocialCategoryId'];
    // this.txtLocality = this.myForm.controls['txtLocality'];
    // this.txtTaluk = this.myForm.controls['txtTaluk'];
    // this.txtDistrict = this.myForm.controls['txtDistrict'];
    // this.intStateId = this.myForm.controls['intStateId'];
    // this.user_type = this.myForm.controls['user_type'];
    // this.intCityId = this.myForm.controls['intCityId'];
    // this.txtPincode = this.myForm.controls['txtPincode'];
    // this.txtPerAddress = this.myForm.controls['txtPerAddress'];
    // this.txtTempAddress = this.myForm.controls['txtTempAddress'];
    // this.group_name = this.myForm.controls['group_name'];
    // this.userLoginId = this.myForm.controls['loginId'];


    this.intClassId = this.myForm.controls['intClassId'];
    // this.intAffiliationId = this.myForm.controls['intAffiliationId'];
    // this.intStreamId = this.myForm.controls['intStreamId'];
    this.intSectionId = this.myForm.controls['intSectionId'];
    // this.nmParentsAnnualIncome = this.myForm.controls['nmParentsAnnualIncome'];
    // this.txtStudentCaste = this.myForm.controls['txtStudentCaste'];
    // this.txtPreviousSchoolName = this.myForm.controls['txtPreviousSchoolName'];
    // this.txtPreviousSchoolAddress = this.myForm.controls['txtPreviousSchoolAddress'];
    // this.txtStudentCasteCertificateNo = this.myForm.controls['txtStudentCasteCertificateNo'];
    // this.txtTransferCertificateNo = this.myForm.controls['txtTransferCertificateNo'];
    // this.dtTransferCertificateDate = this.myForm.controls['dtTransferCertificateDate'];
    // this.txtFathersCasteCertificateNo = this.myForm.controls['txtFathersCasteCertificateNo'];
    this.txtFathersCaste = this.myForm.controls['txtFathersCaste'];
    this.txtMothersCaste = this.myForm.controls['txtMothersCaste'];
    this.txtFMobileNumber = this.myForm.controls['txtFMobileNumber'];
    // this.txtMothersCasteCertificateNo = this.myForm.controls['txtMothersCasteCertificateNo'];
    this.txtFOtherNumber = this.myForm.controls['txtFOtherNumber'];
    this.txtMMobileNumber = this.myForm.controls['txtMMobileNumber'];
    // this.txtMOtherNumber = this.myForm.controls['txtMOtherNumber'];
    // this.dtAdmissionDate = this.myForm.controls['dtAdmissionDate'];
    // this.txtStudentEnrollmentNumber = this.myForm.controls['txtStudentEnrollmentNumber'];
    this.fatherAadharNo = this.myForm.controls['fatherAadharNo'],
      this.motherAadharNo = this.myForm.controls['motherAadharNo']

  }



  ngOnInit() {
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });
    this.loadData();
  }

  // belongToBPL = [
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '0', viewValue: 'No' }
  // ]
  // Disabled = [
  //   { value: '1', viewValue: 'Yes' },
  //   { value: '0', viewValue: 'No' }
  // ]
  // genders = [
  //   { value: '1', viewValue: 'male' },
  //   { value: '0', viewValue: 'female' }
  // ];

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
    // (<FormControl>this.myForm.controls['dtJoiningDate'])
    //   .setValue(this.registration.dtJoiningDate, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFatherName'])
      .setValue(this.registration.txtFatherName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFOccupation'])
      .setValue(this.registration.txtFOccupation, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFEducationalQualification'])
      .setValue(this.registration.txtFEducationalQualification, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtMotherName'])
      .setValue(this.registration.txtMotherName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtMEducationalQualification'])
      .setValue(this.registration.txtMEducationalQualification, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtMOccupation'])
      .setValue(this.registration.txtMOccupation, { onlySelf: true });
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
    (<FormControl>this.myForm.controls['blBelongToBPL'])
      .setValue(this.registration.blBelongToBPL, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtBPLCardNo'])
      .setValue(this.registration.txtBPLCardNo, { onlySelf: true });
    (<FormControl>this.myForm.controls['isDisabled'])
      .setValue(this.registration.isDisabled, { onlySelf: true });
    (<FormControl>this.myForm.controls['intDisabilityId'])
      .setValue(this.registration.intDisabilityId, { onlySelf: true });
    (<FormControl>this.myForm.controls['intSocialCategoryId'])
      .setValue(this.registration.intSocialCategoryId, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtLocality'])
    //   .setValue(this.registration.txtLocality, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtTaluk'])
    //   .setValue(this.registration.txtTaluk, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtDistrict'])
    //   .setValue(this.registration.txtDistrict, { onlySelf: true });
    // (<FormControl>this.myForm.controls['intCityId'])
    //   .setValue(this.registration.intCityId, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtPincode'])
    //   .setValue(this.registration.txtPincode, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtPerAddress'])
    //   .setValue(this.registration.txtPerAddress, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtTempAddress'])
    //   .setValue(this.registration.txtTempAddress, { onlySelf: true });
    // (<FormControl>this.myForm.controls['intStateId'])
    //   .setValue(this.registration.intStateId, { onlySelf: true });
    // (<FormControl>this.myForm.controls['group_name'])
    //   .setValue(this.registration.group_name, { onlySelf: true });
  }

  bindStudentFormValues() {

    (<FormControl>this.myForm.controls['intClassId'])
      .setValue(this.studentData.intClassId, { onlySelf: true });
    // (<FormControl>this.myForm.controls['intAffiliationId'])
    //   .setValue(this.studentData.intAffiliationId, { onlySelf: true });
    (<FormControl>this.myForm.controls['intSectionId'])
      .setValue(this.studentData.intSectionId, { onlySelf: true });
    // (<FormControl>this.myForm.controls['nmParentsAnnualIncome'])
    //   .setValue(this.studentData.nmParentsAnnualIncome, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtStudentCaste'])
    //   .setValue(this.studentData.txtStudentCaste, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtStudentCasteCertificateNo'])
    //   .setValue(this.studentData.txtStudentCasteCertificateNo, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtPreviousSchoolName'])
    //   .setValue(this.studentData.txtPreviousSchoolName, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtPreviousSchoolAddress'])
    //   .setValue(this.studentData.txtPreviousSchoolAddress, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtTransferCertificateNo'])
    //   .setValue(this.studentData.txtTransferCertificateNo, { onlySelf: true });
    // (<FormControl>this.myForm.controls['dtTransferCertificateDate'])
    //   .setValue(this.studentData.dtTransferCertificateDate, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtFathersCasteCertificateNo'])
    //   .setValue(this.studentData.txtFathersCasteCertificateNo, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFathersCaste'])
      .setValue(this.studentData.txtFathersCaste, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtMothersCaste'])
      .setValue(this.studentData.txtMothersCaste, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtMothersCasteCertificateNo'])
    //   .setValue(this.studentData.txtMothersCasteCertificateNo, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFOtherNumber'])
      .setValue(this.studentData.txtFOtherNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtFMobileNumber'])
      .setValue(this.studentData.txtFMobileNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtMMobileNumber'])
      .setValue(this.studentData.txtMMobileNumber, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtMOtherNumber'])
    //   .setValue(this.studentData.txtMOtherNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['dtAdmissionDate'])
      .setValue(this.studentData.dtAdmissionDate, { onlySelf: true });
    // (<FormControl>this.myForm.controls['txtStudentEnrollmentNumber'])
    //   .setValue(this.studentData.txtStudentEnrollmentNumber, { onlySelf: true });
    (<FormControl>this.myForm.controls['fatherAadharNo'])
      .setValue(this.studentData.fatherAadharNo, { onlySelf: true });
    (<FormControl>this.myForm.controls['motherAadharNo'])
      .setValue(this.studentData.motherAadharNo, { onlySelf: true });

  }
  studentData: any;
  registration: any;
  loadstudentdata(registration_id) {
    this.log.consoleLog('registration_id ' + registration_id);
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + registration_id);
    this.dbService.query('mst_student', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((studentTableData) => {
        this.studentData = StudentTableDataType.fromJson(studentTableData);
        this.log.consoleLog(this.studentData);
      });
      this.bindStudentFormValues();
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

    //Login Id of perticular
    this.loggedId = this.userConfig.getRegId();


    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'class_id,class_name');
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
        this.log.consoleLog(this.classes.length);
      });
      this.onClickClass(this.selectedClassId);
    });


    queryFilters.set('fields', 'section_id,section_name');
    this.dbService.query('mst_sections', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((sections) => {
        this.sections.push(Sections.fromJson(sections));
      });
      this.onselectSection(this.selectedSectionId);
    });


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

    // queryFilters.set('fields', 'intCityId,txtCityName');
    // this.dbService.query('mstcity', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((cities) => {
    //     this.cities.push(Cities.fromJson(cities));
    //     this.log.consoleLog(this.cities.length);
    //   });
    //   this.log.consoleLog(data);
    // });

    // queryFilters.set('fields', 'intCountryId,txtCountryName');
    // this.dbService.query('mstcountry', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((countries) => {
    //     this.countries.push(Country.fromJson(countries));
    //     this.log.consoleLog(this.countries.length);
    //   });
    //   this.log.consoleLog(data);
    // });

    queryFilters.set('fields', 'intmothertongueId,txtmothertongue');
    this.dbService.query('mstmothertongue', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((m_tongue) => {
        this.m_tongue.push(MotherTongue.fromJson(m_tongue));
        this.log.consoleLog(this.m_tongue.length);
      });
      this.log.consoleLog(data);
    });

    // queryFilters.set('fields', 'type_id,user_type');
    // this.dbService.query('mst_user_type', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((usertype) => {
    //     this.usertype.push(UserType.fromJson(usertype));
    //     this.log.consoleLog(this.usertype.length);
    //   });
    //   this.log.consoleLog(data);
    // });

    // queryFilters.set('fields', 'id,group_name');
    // this.dbService.query('cfg_group_default_views', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((groupname) => {
    //     this.groupname.push(GroupName.fromJson(groupname));
    //     this.log.consoleLog(this.groupname.length);
    //   });
    //   this.log.consoleLog(data);
    // });





    // queryFilters.set('fields', 'intStreamId,txtStream');
    // this.dbService.query('mststream', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((streams) => {
    //     this.streams.push(Streams.fromJson(streams));
    //     this.log.consoleLog(this.streams.length);
    //   });
    //   this.log.consoleLog(data);
    // })

    // queryFilters.set('fields', 'intAffiliationId,txtAffiliation');
    // this.dbService.query('mstaffiliation', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((affiliations) => {
    //     this.affiliations.push(Affiliation.fromJson(affiliations));
    //     this.log.consoleLog(this.affiliations.length);
    //   });
    //   this.log.consoleLog(data);
    // })


    // queryFilters.set('fields', 'intDistrictId,txtDistrictName,intStateId');
    // this.dbService.query('mstdistrict', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((district) => {
    //     this.district.push(District.fromJson(district));
    //     this.log.consoleLog(this.district.length);
    //   });
    //   this.log.consoleLog(data);
    // });

    // queryFilters.set('fields', 'intTalukId,txtTalukName,intDistrictId');
    // this.dbService.query('msttaluk', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((taluk) => {
    //     this.taluk.push(Taluk.fromJson(taluk));
    //     this.log.consoleLog(this.taluk.length);
    //   });
    //   this.log.consoleLog(data);
    // });

    // queryFilters.set('fields', 'txtStateName,intStateId,intCountryId');
    // this.dbService.query('mststate', '', queryFilters).subscribe((result) => {
    //   var data: any = result.json();
    //   data.resource.forEach((states) => {
    //     this.states.push(States.fromJson(states));
    //     this.log.consoleLog(this.states.length);
    //   });
    //   this.log.consoleLog(data);
    // });

  }

  onClickClass(_class) {
    this.selectedClassId = _class;
    if (_class > 0) {
      this.classes.filter((viewdata) => {
        if (viewdata.class_id == _class) {
          this.selectedClass = viewdata.class_name;
        }
      });
    }
    else {
      this.selectedClass = "";
      this.selectedsection = "";
    }
  }

  onselectSection(_section) {
    this.selectedSectionId = _section;
    if (_section > 0) {
      this.sections.filter((data) => {
        if (data.section_id == _section) {
          this.selectedsection = data.section_name;
        }
        this.log.consoleLog(this.selectedsection);
      });
    }
    else {
      this.selectedsection = "";
    }
    if (this.selectedClassId > 0 && this.selectedSectionId > 0) {
      this.onLoadStudentDetailsWRTclassSection(this.selectedClassId, this.selectedSectionId);
    }
  }

  onSelectSectionWRTClass(Class_id) {
    if (Class_id > 0) {
      let param = {
        "name": "Class_id",
        "value": Class_id
      };
      this.dbService.getDataFromProc('selectSectionWRTClass', param).subscribe((result) => {
        {
          this.sectionNames = []
          result.resource.forEach((item) => {
            this.sectionNames.push(Sections.fromJson(item));
          });
        }
      });
      this.log.consoleLog(this.sectionNames);
    }
    else {
      this.sectionNames = [];
    }
  }

  onLoadStudentDetailsWRTclassSection(class_id, section_id) {
    let param = [{
      "name": "class_id",
      "value": class_id,
    },
    {
      "name": "section_id",
      "value": section_id,
    },
    ];
    this.dbService.getDataFromProc('mstStudentEmailInfoSection', param).subscribe((result) => {

      {
        this.studentDetails = []
        result.resource.forEach((item) => {
          this.studentDetails.push(StudentsWrtClassSection.fromJson(item));
          this.log.consoleLog(this.studentDetails);
        });
      }
    });
  }


  perticulrStudentDetails = [];
  registrationId: number;
  onClickStudent(item) {
    this.registrationId = item.intRegistrationId;
    this.perticulrStudentDetails = [];
    this.disableListOnclickStudent = true;
    this.log.consoleLog(item);
    this.loadstudentdata(item.intRegistrationId);
    this.perticulrStudentDetails.push(item);

    this.log.consoleLog(this.perticulrStudentDetails);
    this.log.consoleLog(item.txtFirstName);
  }

  onClickbackToList() {
    this.disableListOnclickStudent = false;
  }

  select = 1;
  onClicktab(tabnumber) {
    this.select = tabnumber;
  }


  // onClickUpdate() {

  // }

  onClickUpdate() {
    this.log.consoleLog((this.myForm.getRawValue()));
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + this.registrationId);
    this.log.consoleLog(this.studentUpdateDoc());
    this.log.consoleLog(this.generalUpdatetDoc());
    // Update records to database 
    this.dbService.update('mst_registration', this.generalUpdatetDoc(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);
      if (data.resource.length > 0) {
        this.notify.success("Success", data.resource.length + " Records Updated");
      }
    }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });


    this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'intRegistrationId= ' + this.registrationId);

    this.dbService.update('mst_student', this.studentUpdateDoc(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);

    });

    queryFilters.set('filter', 'registration_id= ' + this.registrationId);

    this.dbService.update('map_student_cs', this.insertStudentRecordsCsDoc(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);

    });
    this.disableListOnclickStudent = false;

  }

  // updateStudentTable() {

  //   this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
  //   var queryFilters = new URLSearchParams();
  //   queryFilters.set('filter', 'intRegistrationId= ' + this.registrationId);

  //   this.dbService.update('mst_student', this.studentUpdateDoc(), queryFilters).subscribe((data) => {
  //     this.log.consoleLog(data);

  //   });

  //   queryFilters.set('filter', 'registration_id= ' + this.registrationId);

  //   this.dbService.update('map_student_cs', this.insertStudentRecordsCsDoc(), queryFilters).subscribe((data) => {
  //     this.log.consoleLog(data);

  //   });


  // }


  insertStudentRecordsCsDoc() {
    var doc = {
      class_id: this.intClassId.value,
      section_id: this.intSectionId.value,
      created_by: this.loggedId
    }
    return doc;
  }

  studentUpdateDoc() {
    var doc = {
      intRegistrationId: this.registrationId,
      intClassId: this.intClassId.value,
      // intAffiliationId: this.intAffiliationId.value,
      // intStreamId: this.intStreamId.value,
      intSectionId: this.intSectionId.value,
      // nmParentsAnnualIncome: this.nmParentsAnnualIncome.value,
      // txtStudentCaste: this.txtStudentCaste.value,
      // txtPreviousSchoolName: this.txtPreviousSchoolName.value,
      // txtPreviousSchoolAddress: this.txtPreviousSchoolAddress.value,
      // txtStudentCasteCertificateNo: this.txtStudentCasteCertificateNo.value,
      // txtTransferCertificateNo: this.txtTransferCertificateNo.value,
      // dtTransferCertificateDate: this.dtTransferCertificateDate.value,
      // txtFathersCasteCertificateNo: this.txtFathersCasteCertificateNo.value,
      // txtFathersCaste: this.txtFathersCaste.value,
      // txtMothersCaste: this.txtMothersCaste.value,
      txtFMobileNumber: this.txtFMobileNumber.value,
      // txtMothersCasteCertificateNo: this.txtMothersCasteCertificateNo.value,
      txtFOtherNumber: this.txtFOtherNumber.value,
      // txtMMobileNumber: this.txtMMobileNumber.value,
      // txtMOtherNumber: this.txtMOtherNumber.value,
      // dtAdmissionDate: this.dtAdmissionDate.value,
      // txtStudentEnrollmentNumber: this.txtStudentEnrollmentNumber.value,
      // fatherAadharNo: this.fatherAadharNo.value,
      // motherAadharNo: this.motherAadharNo.value
    }
    return doc;
  }

  generalUpdatetDoc() {

    var doc = {
      txtFirstName: this.txtFirstName.value,
      txtLastName: this.txtLastName.value,
      txtMiddleName: this.txtMiddleName.value,
      txtEmailId: this.txtEmailId.value,
      dtDOB: this.dtDOB.value,
      txtFatherName: this.txtFatherName.value,
      txtFOccupation: this.txtFOccupation.value,
      txtFEducationalQualification: this.txtFEducationalQualification.value,
      txtMotherName: this.txtMotherName.value,
      txtMEducationalQualification: this.txtMEducationalQualification.value,
      txtMOccupation: this.txtMOccupation.value,
      intGenderId: this.intGenderId.value,
      intmothertongueId: this.intmothertongueId.value,
      intReligionId: this.intReligionId.value,
      bloodGroup: this.bloodGroup.value,
      txtAadharNumber: this.txtAadharNumber.value,
      // txtNationality: this.txtNationality.value,
      blBelongToBPL: this.blBelongToBPL.value,
      txtBPLCardNo: this.txtBPLCardNo.value,
      isDisabled: this.disability.value,
      intDisabilityId: this.intDisabilityId.value,
      intSocialCategoryId: this.intSocialCategoryId.value,
      // txtLocality: this.txtLocality.value,
      // txtTaluk: this.txtTaluk.value,
      // txtDistrict: this.txtDistrict.value,
      // intStateId: this.intStateId.value,
      // user_type: this.user_type.value,
      // intCityId: this.intCityId.value,
      // txtPincode: this.txtPincode.value,
      // txtPerAddress: this.txtPerAddress.value,
      // txtTempAddress: this.txtTempAddress.value,
      // group_name: this.group_name.value,
      // loginId: this.userLoginId.value
    }
    return doc;
  }
}
