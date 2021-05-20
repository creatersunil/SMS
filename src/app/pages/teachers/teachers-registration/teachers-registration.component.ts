import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { SnotifyService, SnotifyConfig } from 'ng-snotify';
//Classes and services
import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { UtilsService } from '../../../utils/utils.service';
import { TeachersList } from './teachers-list';
// import { TeacherSkilldetails } from './teacher-skill-details';
import { MaritalStatus } from './marital-status';
import { Skills } from './skills';
import { Religion } from './religion';
import { MotherTongue } from './motherTongue';
// import { RecentlyRegisteredStaff } from './recently-registered-staff';
import { GroupName } from './group-name';

@Component({
  selector: 'app-teachers-registration',
  templateUrl: './teachers-registration.component.html',
  styleUrls: ['./teachers-registration.component.scss', '../../students/students.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService]
})
export class TeachersRegistrationComponent implements OnInit {
  public createNewRegistration: boolean = false;
  myForm: FormGroup;
  subscription: Subscription;

  // public teachersSkillDetailsList: any[] = new Array<TeacherSkilldetails>();
  public religions: any[] = new Array<Religion>();
  public m_tongue: any[] = new Array<MotherTongue>();
  public skills: any[] = new Array<Skills>();
  public maritalStatus: any[] = new Array<MaritalStatus>();
  public recentlyRegisteredStaff: any = new Array<TeachersList>();
  public groupname: any[] = new Array<GroupName>();
  public genders: any[] = this.utilSetvice.genders;
  public date: number;
  public loggedId: any;

  // genders = [
  //   { value: '1', viewValue: 'male' },
  //   { value: '0', viewValue: 'female' }
  // ];

  public txtFirstName: AbstractControl;
  public txtLastName: AbstractControl;
  public display_name: AbstractControl;
  public txtEmailId: AbstractControl;
  public password: AbstractControl;
  public txtMiddleName: AbstractControl;
  public dtDOB: AbstractControl;
  public dtJoiningDate: AbstractControl;
  public txtFatherName: AbstractControl;
  // public txtFOccupation:AbstractControl;
  //public txtFEducationalQualification:AbstractControl;
  //public txtMotherName:AbstractControl;
  // public txtMEducationalQualification:AbstractControl;
  //public txtMOccupation:AbstractControl;
  public intGenderId: AbstractControl;
  public intmothertongueId: AbstractControl;
  public intReligionId: AbstractControl;
  public bloodGroup: AbstractControl;
  public txtAadharNumber: AbstractControl;
  public txtNationality: AbstractControl;
  //public blBelongToBPL:AbstractControl;
  //public txtBPLCardNo:AbstractControl;
  //public disability:AbstractControl;
  //public intDisabilityId:AbstractControl;
  //public intSocialCategoryId:AbstractControl;
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


  public txtMobileNumber: AbstractControl;
  public txtRelativeNumber: AbstractControl;
  public txtAlternateMobileNumber: AbstractControl;
  public intMaritalStatusId: AbstractControl;
  public qualification: AbstractControl;
  public designation: AbstractControl;
  public skillId: AbstractControl;
  public txtPreviousSchoolName: AbstractControl;
  public txtPreviousSchoolAddress: AbstractControl;
  public subjects: AbstractControl;
  public experience: AbstractControl;
  //public intMaritalStatusId:AbstractControl;
  public phone: any;
  public submitted: boolean = false;
  constructor(private formBuilder: FormBuilder, private utilSetvice: UtilsService, private notify: SnotifyService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) {
    this.myForm = formBuilder.group({
      'txtFirstName': ['', Validators.compose([Validators.required])],
      'txtMiddleName': [''],
      'txtLastName': [''],
      'txtEmailId': ['',
        Validators.compose([Validators.required,
        Validators.pattern("[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})")
        ])],
      'dtDOB': ['', Validators.required],
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
      'user_type': ['1'],
      'intCityId': [''],
      'intStateId': [''],
      'txtPincode': [''],
      'txtPerAddress': [''],
      'txtTempAddress': [''],
      'loginId': [''],
      'group_name': [''],
      'password': [''],


      'txtMobileNumber': [''],
      'txtRelativeNumber': [''],
      'txtAlternateMobileNumber': [''],
      'intMaritalStatusId': [''],
      'qualification': [''],
      'designation': [''],
      'skillId': ['', Validators.required],
      'txtPreviousSchoolName': [''],
      'txtPreviousSchoolAddress': [''],
      'subjects': [''],
      'experience': [''],
    });
    this.txtFirstName = this.myForm.controls['txtFirstName'];
    this.txtLastName = this.myForm.controls['txtLastName'];
    this.txtMiddleName = this.myForm.controls['txtMiddleName'];
    this.txtEmailId = this.myForm.controls['txtEmailId'];
    this.password = this.myForm.controls['password'];
    this.dtDOB = this.myForm.controls['dtDOB'];
    this.dtJoiningDate = this.myForm.controls['dtJoiningDate'];
    this.txtFatherName = this.myForm.controls['txtFatherName'];
    //            this.txtFOccupation= this.myForm.controls['txtFOccupation'];
    //         this.txtFEducationalQualification=this.myForm.controls['txtFEducationalQualification'];
    //       this.txtMotherName     =this.myForm.controls['txtMotherName'];
    //     this.txtMEducationalQualification = this.myForm.controls['txtMEducationalQualification'];
    //   this.txtMOccupation     = this.myForm.controls['txtMOccupation'];
    this.intGenderId = this.myForm.controls['intGenderId'];
    this.intmothertongueId = this.myForm.controls['intmothertongueId'];
    this.intReligionId = this.myForm.controls['intReligionId'];
    this.bloodGroup = this.myForm.controls['bloodGroup'];
    this.txtAadharNumber = this.myForm.controls['txtAadharNumber'];
    this.txtNationality = this.myForm.controls['txtNationality'];
    // this.blBelongToBPL      = this.myForm.controls['blBelongToBPL'];
    //this.txtBPLCardNo       = this.myForm.controls['txtBPLCardNo'];
    //this.disability         =this.myForm.controls['isDisabled'];
    //this.intDisabilityId    =this.myForm.controls['intDisabilityId'];
    //this.intSocialCategoryId= this.myForm.controls['intSocialCategoryId'];
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


    this.txtMobileNumber = this.myForm.controls['txtMobileNumber'];
    this.txtRelativeNumber = this.myForm.controls['txtRelativeNumber'];
    this.intMaritalStatusId = this.myForm.controls['intMaritalStatusId'];
    this.txtAlternateMobileNumber = this.myForm.controls['txtAlternateMobileNumber'];
    this.qualification = this.myForm.controls['qualification'];
    this.designation = this.myForm.controls['designation'];
    this.skillId = this.myForm.controls['skillId'];
    this.txtPreviousSchoolName = this.myForm.controls['txtPreviousSchoolName'];
    this.txtPreviousSchoolAddress = this.myForm.controls['txtPreviousSchoolAddress'];
    this.subjects = this.myForm.controls['subjects'];
    this.experience = this.myForm.controls['experience'];



    // this.subscription = this.messageService.getMessage().subscribe(message => {
    //   this.message = message;
    //   this.log.consoleLog("Recieved Meassage");
    //   this.log.consoleLog(this.message);
    // })

  }

  ngOnInit() {
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });
    this.loadData();
    this.onLoadRecentlyRegisteredStaff();
    // this.onLoadTeachersSkillDetails();
    this.loggedId = this.userConfig.getRegId();
  }

  onChangeSkill() {
    (<FormArray>this.myForm.get('skillId')).push(new FormControl('', Validators.required));
  }

  /**
   * bind data to dreamfactory
   */
  dataInputToDreamFactory(stringify?: boolean): any {
    var doc = {
      email: this.txtEmailId.value,
      first_name: this.txtFirstName.value,
      last_name: this.txtLastName.value,
      display_name: this.txtFirstName.value + " " + this.txtLastName.value,
      new_password: this.password.value,
      code: "work",
      school_id: this.userConfig.getSchoolId(),
      school_code: this.userConfig.getSchoolCode(),
      phone: this.txtMobileNumber.value,
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
   * On Click Save Staff Registration
   */
  onClickRegistrationSave() {

    this.log.consoleLog(this.myForm.getRawValue());
    (<FormControl>this.myForm.controls['password'])
      .setValue(this.generatePassword(), { onlySelf: true });
    this.submitted = true;
    this.dbService.register(this.dataInputToDreamFactory(true)).subscribe((response) => {
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
      }
    });
  }


  /**
   * ON CLICK CANCEL
   */

  onClickRegistrationCancel() {
    this.myForm.reset();
    this.createNewRegistration = false;
  }


  loadData() {

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
        this.maritalStatus.push(MaritalStatus.fromJson(m_status));
        this.log.consoleLog(this.maritalStatus.length);
      });
      this.log.consoleLog(data);

    })

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



  registrationId: any;
  insert() {
    this.log.consoleLog(this.generalInsertDoc());
    this.dbService.insert('mst_registration', this.generalInsertDoc()).subscribe((data) => {
      this.log.consoleLog(data);
      this.registrationId = (data.resource[0].intRegistrationId);
      this.onAdditionOfSkillsOfTeacher();
      this.log.consoleLog(this.staffInsertDoc());
      this.dbService.insert('mst_staff', this.staffInsertDoc()).subscribe((response) => {
        this.log.consoleLog(response);
        //dialog.show();
      });
      this.dbService.insert('map_subj_teach', this.skillDataToInsertDB).subscribe((response) => {
        this.log.consoleLog(response);
        //dialog.show();
      });
      if (data.resource.length > 0) {
        this.notify.success("Success", data.resource.length + " Records Registered");
      }
      this.myForm.reset();
    }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });

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
      dtJoiningDate: this.dtJoiningDate.value,
      txtFatherName: this.txtFatherName.value,
      // txtFOccupation:this.txtFOccupation.value,
      // txtFEducationalQualification:this.txtFEducationalQualification.value,
      // txtMotherName:this.txtMotherName.value,
      // txtMEducationalQualification:this.txtMEducationalQualification.value,
      //  txtMEducationalQualification
      // txtMOccupation     :this.txtMOccupation.value,
      intGenderId: this.intGenderId.value,
      intmothertongueId: this.intmothertongueId.value,
      intReligionId: this.intReligionId.value,
      bloodGroup: this.bloodGroup.value,
      txtAadharNumber: this.txtAadharNumber.value,
      txtNationality: this.txtNationality.value,
      // blBelongToBPL      :this.blBelongToBPL.value,
      // txtBPLCardNo       :this.txtBPLCardNo.value,
      // isDisabled         :this.disability.value,
      // intDisabilityId    :this.intDisabilityId.value,
      // intSocialCategoryId:this.intSocialCategoryId.value,
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

  staffInsertDoc() {
    var doc = {
      txtMobileNumber: this.txtMobileNumber.value,
      txtRelativeNumber: this.txtRelativeNumber.value,
      txtAlternateMobileNumber: this.txtAlternateMobileNumber.value,
      qualification: this.qualification.value,
      designation: this.designation.value,
      skillId: this.skillId.value,
      txtPreviousSchoolName: this.txtPreviousSchoolName.value,
      txtPreviousSchoolAddress: this.txtPreviousSchoolAddress.value,
      intRegistrationId: this.registrationId,
      intMaritalStatusId: this.intMaritalStatusId.value,
      experience: this.experience.value
    }
    return doc;
  }


  public duplicateTeacherList: any[] = new Array<TeachersList>();
  onLoadRecentlyRegisteredStaff() {
    this.dbService.getDataFromProc('mstRecentlyRegisteredTeachersDetails', '').subscribe((result) => {

      {
        this.recentlyRegisteredStaff = []
        result.resource.forEach((item) => {
          this.recentlyRegisteredStaff.push(TeachersList.fromJson(item));

        });
      }
      this.log.consoleLog(this.recentlyRegisteredStaff);
      this.duplicateTeacherList = _.cloneDeep(this.recentlyRegisteredStaff);
      this.onCombineDuplicateRegNameIntoOnBasedOnSkill();
    });
  }


  dataTableListData: any[] = new Array<TeachersList>();
  onCombineDuplicateRegNameIntoOnBasedOnSkill() {
    for (var i = 0; i < this.duplicateTeacherList.length; i++) {
      this.duplicateTeacherList.filter((data) => {
        if (data.intRegistrationId == this.duplicateTeacherList[i].intRegistrationId) {
          this.duplicateTeacherList[i].skills.push(this.skillRegDoc(data.skill_name));
        }
      })
    }
    this.duplicateTeacherList = this.utilSetvice.removeDulpicates(this.duplicateTeacherList, 'intRegistrationId');
    this.log.consoleLog(this.duplicateTeacherList);
    this.dataTableListData = this.duplicateTeacherList;
  }

  skillRegDoc(_skill_name) {
    var doc = {
      skill_name: _skill_name
    }
    return doc;
  }


  public teacherSKillDataBasedOnPerSkill: any = new Array<TeachersList>();
  onLoadSkillDataBasedOnSelectedSkillData(skillId) {
    if (skillId > 0) {
      this.teacherSKillDataBasedOnPerSkill = []
      this.log.consoleLog(skillId)
      this.recentlyRegisteredStaff.filter((data) => {
        if (data.skillId == skillId) {
          this.teacherSKillDataBasedOnPerSkill.push(data);
        }
      });

      for (var i = 0; i < this.teacherSKillDataBasedOnPerSkill.length; i++) {
        this.teacherSKillDataBasedOnPerSkill.filter((data) => {
          if (data.intRegistrationId == this.teacherSKillDataBasedOnPerSkill[i].intRegistrationId) {
            this.teacherSKillDataBasedOnPerSkill[i].skills.push(this.skillRegDoc(data.skill_name));
          }
        })
      }
      this.teacherSKillDataBasedOnPerSkill = this.utilSetvice.removeDulpicates(this.teacherSKillDataBasedOnPerSkill, 'inRegistrationId');
      this.log.consoleLog(this.teacherSKillDataBasedOnPerSkill);
      this.dataTableListData = this.teacherSKillDataBasedOnPerSkill;
    }
    else {
      this.dataTableListData = this.duplicateTeacherList;
      this.log.consoleLog(this.dataTableListData.length)
    }
  }

  // onLoadTeachersSkillDetails() {
  //   this.dbService.getDataFromProc('MapTeacherDataBasedOnTeacherSkillData', '').subscribe((result) => {

  //     {
  //       this.teachersSkillDetailsList = []
  //       result.resource.forEach((item) => {
  //         this.teachersSkillDetailsList.push(TeacherSkilldetails.fromJson(item));
  //         this.log.consoleLog(this.teachersSkillDetailsList);
  //       });
  //     }
  //   });
  // }


  onClickEnableNewregistration() {
    this.createNewRegistration = true;
  }

  onClickBackToList() {
    this.createNewRegistration = false;
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





  selecedTeacherSkills: any[] = new Array<Skills>();
  skillLimit: boolean = false;
  onSelectSkills(skillValue) {
    this.log.consoleLog(skillValue);
    this.log.consoleLog(this.selecedTeacherSkills.length)
    if (this.selecedTeacherSkills.length > 2) {
      this.skillLimit = true;
    }
    else {
      this.skills.filter((data) => {
        if (data.skillId == skillValue) {
          this.skills.splice(this.skills.indexOf(data), 1);
          this.selecedTeacherSkills.push(data);
          this.skillLimit = false;
          this.log.consoleLog(this.selecedTeacherSkills.length)
        }
      });
    }

    this.log.consoleLog(this.selecedTeacherSkills);
  }

  onClickRemoveSkill(skilldata) {
    this.log.consoleLog(skilldata);
    this.skills.push(skilldata);
    this.selecedTeacherSkills.splice(this.selecedTeacherSkills.indexOf(skilldata), 1);
  }

  skillDataToInsertDB = [];
  onAdditionOfSkillsOfTeacher() {
    for (var i = 0; i < this.selecedTeacherSkills.length; i++) {
      this.skillDataToInsertDB.push(this.skillDoc(this.selecedTeacherSkills[i].skillId));
    }
    this.log.consoleLog("Praveen skill");
    this.log.consoleLog(this.skillDataToInsertDB);
    this.log.consoleLog("Praveen skill");
  }

  skillDoc(_sub_code) {
    var doc = {
      sub_code: _sub_code,
      teacher_id: this.registrationId,
      created_by: this.loggedId
    }
    return doc;
  }

  public userGroup: boolean = false;
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




}
