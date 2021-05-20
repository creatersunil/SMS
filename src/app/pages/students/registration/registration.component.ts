
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

//Classes and services
import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { UtilsService } from './../../../utils/utils.service';
import { Religion } from './religion';
import { Disability } from './disability';
import { Classes } from '../../../services';
import { Sections } from '../../../services';
import { SocialCatagory } from './social-catagory';
import { MotherTongue } from './motherTongue';
import { StudentsWrtClassSection } from './studentsdetailsWrtClassSection';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../students.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService,UtilsService]
})
export class RegistrationComponent implements OnInit {

  public createNewRegistration: boolean = false;
  myForm: FormGroup;
  subscription: Subscription;
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
  public mediumOfInstruction:any[]=this.utilService.mediumOfInstruction;
  public date: number;
  public loggedId: any;
  public previousSchooldetails: boolean = false;
  public selectedClass: string;
  public selectedClassId: number;
  public selectedsection: string;
  public selectedSectionId: number;

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

  onClickEnableNewregistration() {
    this.createNewRegistration = true;
  }

  onClickBackToList() {
    this.createNewRegistration = false;
    this.myForm.reset();
  }

  constructor(private formBuilder: FormBuilder, private utilService: UtilsService, private notify: SnotifyService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) {
    this.myForm = formBuilder.group({
      'txtFirstName': ['', Validators.compose([Validators.required])],
      'txtMiddleName': [''],
      'txtLastName': [''],
      'txtEmailId': ['',
        Validators.compose([Validators.required,
        Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
        ])],
      'dtDOB': [''],
      'dtJoiningDate': [''],
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

      'password': [''],


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
      'motherAadharNo': [''],
      'int_medium':['']
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
    this.onLoadStudentsRecentlyRegistered();
  }

  onClickRegistrationSave() {
    (<FormControl>this.myForm.controls['password'])
      .setValue(this.generatePassword(), { onlySelf: true });
    this.log.consoleLog(this.myForm.getRawValue());
    this.submitted = true;

    this.dbService.register(this.toJson(true)).subscribe((response) => {
      this.log.consoleLog("after reg")
      this.log.consoleLog(response);
      this.log.consoleLog("Step1")
      this.log.consoleLog(response.status);
      if (response.status == 200 && response.statusText == "OK") {
        this.log.consoleLog("success");
        this.insert();

        this.dbService.insertUserToSchool(this.schoolOrg()).subscribe((data) => {
          //this.log.consoleLog('school data');
          this.log.consoleLog(data);
        });
      }
      else if (response.status == 400 && response.statusText == "Bad Request") {
        this.log.consoleLog("already mail id exists");
        this.notify.error("Error", "Mail Id already Exists!!");
      }
    });
  }

  onClickRegistrationCancel() {
    this.log.consoleLog("Cancel Clicked");
    this.myForm.reset();
    this.createNewRegistration = false;
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
      this.onLoadStudentsRecentlyRegistered();
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
      this.onLoadStudentRecentlyRegisteredWRTclassSection(this.selectedClassId, this.selectedSectionId);
    }
  }

  onClckRow() {
    this.log.consoleLog("OKKKK")
  }

  onClickPreviousSchoolCheckbox(eventdata) {
    if (eventdata.target.checked) {
      this.previousSchooldetails = true;
    }
    else {
      this.previousSchooldetails = false;
    }
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


  /**
   * Load initial necessary data feom data base
   *
   */
  loadData() {

    //Login Id of perticular
    this.loggedId = this.userConfig.getRegId();

    this.dbService.getDateTime('getDate').subscribe((date) => {
      this.date = date;
      this.log.consoleLog(this.date);
    });


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

  // Load Recently Registered Student Details
  onLoadStudentsRecentlyRegistered() {
    this.studentDetails = [];
    this.dbService.getDataFromProc('mstStudentsRecentlyAddedData', '').subscribe((result) => {

      {
        this.studentDetails = []
        result.resource.forEach((item) => {
          this.studentDetails.push(StudentsWrtClassSection.fromJson(item));
          this.log.consoleLog(this.studentDetails);
        });
      }
    });
  }

  // Load Recently Registered Student Details Based On Class and Section
  onLoadStudentRecentlyRegisteredWRTclassSection(class_id, section_id) {
    this.studentDetails = [];
    let param = [{
      "name": "class_id",
      "value": class_id,
    },
    {
      "name": "section_id",
      "value": section_id,
    },
    ];
    this.dbService.getDataFromProc('mstStudentsRecentlyAddedDataClassSection', param).subscribe((result) => {

      {
        this.studentDetails = []
        result.resource.forEach((item) => {
          this.studentDetails.push(StudentsWrtClassSection.fromJson(item));
          this.log.consoleLog(this.studentDetails);
        });
      }
    });
  }

  //Genereate Password for user on SUbmit
  generatePassword(): any {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  // insert record On Submit once Validation done with dreamfactory
  registrationId: any;
  insert() {

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
      });
      this.dbService.insert("map_student_cs", this.insertStudentRecordsCsDoc()).subscribe((data) => {
        this.log.consoleLog(data);
      });
      if (data.resource.length > 0) {
        this.notify.success("Success", data.resource.length + " Records Registered");
      }
      this.myForm.reset();

    }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });

  }


  generalInsertDoc() {

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
      // intAffiliationId: this.intAffiliationId.value,
      // intStreamId: this.intStreamId.value,
      intSectionId: this.intSectionId.value,
      nmParentsAnnualIncome: this.nmParentsAnnualIncome.value,
      txtStudentCaste: this.txtStudentCaste.value,
      txtPreviousSchoolName: this.txtPreviousSchoolName.value,
      txtPreviousSchoolAddress: this.txtPreviousSchoolAddress.value,
      txtStudentCasteCertificateNo: this.txtStudentCasteCertificateNo.value,
      txtTransferCertificateNo: this.txtTransferCertificateNo.value,
      dtTransferCertificateDate: this.dtTransferCertificateDate.value,
      // txtFathersCasteCertificateNo: this.txtFathersCasteCertificateNo.value,
      txtFathersCaste: this.txtFathersCaste.value,
      txtMothersCaste: this.txtMothersCaste.value,
      txtFMobileNumber: this.txtFMobileNumber.value,
      // txtMothersCasteCertificateNo: this.txtMothersCasteCertificateNo.value,
      txtFOtherNumber: this.txtFOtherNumber.value,
      txtMMobileNumber: this.txtMMobileNumber.value,
      // txtMOtherNumber: this.txtMOtherNumber.value,
      dtAdmissionDate: this.dtAdmissionDate.value,
      // txtStudentEnrollmentNumber: this.txtStudentEnrollmentNumber.value,
      intRegistrationId: this.registrationId,
      fatherAadharNo: this.fatherAadharNo.value,
      motherAadharNo: this.motherAadharNo.value,
      int_medium:this.myForm.getRawValue().int_medium
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


  //Disable BPL card Number If Not BPL crad holder
  disabletable = false;
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
  isDisabled = false;
  onClickeDisabled(disValue) {
    if (disValue == 1) {
      this.isDisabled = true;
    }
    else {
      this.isDisabled = false;
    }
  }


  tempAddressSameAsPerAddress(eventData, peraddress) {
    if (eventData.target.checked) {
      (<FormControl>this.myForm.controls['txtTempAddress'])
        .setValue(this.txtPerAddress.value, { onlySelf: true });
    }
    else {
      (<FormControl>this.myForm.controls['txtTempAddress'])
        .setValue('', { onlySelf: true });
    }
  }



  selectedEntities: any[];
  // function to handle data/entities selected/deselected in the table
  public setSelectedEntities($event: any) {
    this.selectedEntities = $event;
  }
}
