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

//Classes and servises
import { TeacherSkilldetails } from '../teachers-registration/teacher-skill-details';
import { TeachersList } from './teachers-list';
import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { UtilsService } from '../../../utils/utils.service';
import { MaritalStatus } from '../teachers-registration/marital-status';
import { Skills } from '../teachers-registration/skills';
import { Religion } from '../teachers-registration/religion';
import { MotherTongue } from '../teachers-registration/motherTongue';
import { StaffTableDataType } from './staffTableData';
import { RegitrationTableDataType } from './registrationTableData';
import { GroupName } from '../teachers-registration/group-name';
// import { RecentlyRegisteredStaff } from './recently-registered-staff';

@Component({
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.component.html',
  styleUrls: ['./teachers-list.component.scss', '../../students/students.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService]

})
export class TeachersListComponent implements OnInit {
  public select: number = 1;
  public myForm: FormGroup;
  public religions: any[] = new Array<Religion>();
  public m_tongue: any[] = new Array<MotherTongue>();
  public skills: any[] = new Array<Skills>();
  public maritalStatus: any[] = new Array<MaritalStatus>();
  public teachersSkillDetailsList: any[] = new Array<TeacherSkilldetails>();
  public groupname: any[] = new Array<GroupName>();
  public genders: any[] = this.utilSetvice.genders;
  public staffData: any;
  public registration: any;
  // public recentlyRegisteredStaff: any = new Array<RecentlyRegisteredStaff>();
  public teachersList: any[] = new Array<TeachersList>();
  public disableListOnclickTeacher: boolean = false;
  constructor(private formBuilder: FormBuilder, private utilSetvice: UtilsService, private notify: SnotifyService, private dbService: DbService, private log: Logs, private userConfig: UserConfig) {
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
      'experience': ['', Validators.required],
      //'blImage':['']

    });
  }

  ngOnInit() {
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });
    this.onLoadTaechers();
    // this.onLoadTeachersSkillDetails();
    this.loadData();
    this.loginId = this.userConfig.getRegId();
    // this.samplePractice();
  }


  registrationId: number;
  skillDetailsOfPerticularTeacher = [];
  onEnableViewProfile(item) {
    this.skillDetailsOfPerticularTeacher = [];
    this.registrationId = item.intRegistrationId;
    this.teachersList.filter((data) => {
      if (data.intRegistrationId == this.registrationId) {
        this.skillDetailsOfPerticularTeacher.push(this.skillPerticularTeacherDoc(data.skill_name, parseInt(data.skillId), data.row_id));
      }
    })
    this.log.consoleLog(item);
    this.loadStaffdata(item.intRegistrationId);
  }

  ///Selected Teacher skill data doc
  skillPerticularTeacherDoc(_skill_name, _skillId, _row_id) {
    var doc = {
      row_id: _row_id,
      teacher_id: this.registrationId,
      skill_name: _skill_name,
      skillId: _skillId
    }
    return doc;
  }

  dataTableListData = [];
  duplicateTeacherList: any[] = new Array<TeachersList>()
  onLoadTaechers() {
    this.dbService.getDataFromProc('getTeachersRecordsbasedOnSkills', '').subscribe((result) => {

      {
        this.teachersList = []
        result.resource.forEach((item) => {
          this.teachersList.push(TeachersList.fromJson(item));

        });
      }
      this.log.consoleLog(this.teachersList);
      // this.dataTableListData = this.teachersList;
      this.duplicateTeacherList = _.cloneDeep(this.teachersList);
      this.onCombineDuplicateRegNameIntoOnBasedOnSkill();
    });
  }

  onCombineDuplicateRegNameIntoOnBasedOnSkill() {
    for (var i = 0; i < this.duplicateTeacherList.length; i++) {
      this.duplicateTeacherList.filter((data) => {
        if (data.intRegistrationId == this.duplicateTeacherList[i].intRegistrationId) {
          this.duplicateTeacherList[i].skills.push(this.skillDoc(data.skill_name));
        }
      })
    }
    this.duplicateTeacherList = this.utilSetvice.removeDulpicates(this.duplicateTeacherList, 'intRegistrationId');
    this.dataTableListData = this.duplicateTeacherList;
  }

  skillDoc(_skill_name) {
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
      this.teachersList.filter((data) => {
        if (data.skillId == skillId) {
          this.teacherSKillDataBasedOnPerSkill.push(data);
        }
      });
      for (var i = 0; i < this.teacherSKillDataBasedOnPerSkill.length; i++) {
        this.teacherSKillDataBasedOnPerSkill.filter((data) => {
          if (data.intRegistrationId == this.teacherSKillDataBasedOnPerSkill[i].intRegistrationId) {
            this.teacherSKillDataBasedOnPerSkill[i].skills.push(this.skillDoc(data.skill_name));
          }
        })
      }
      this.log.consoleLog(this.teacherSKillDataBasedOnPerSkill);
      this.dataTableListData = this.teacherSKillDataBasedOnPerSkill;
    }
    else {
      this.dataTableListData = this.duplicateTeacherList;
      this.log.consoleLog(this.dataTableListData.length)
    }
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
      this.disableListOnclickTeacher = true;
    })
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
    // (<FormControl>this.myForm.controls['skillId'])
    //   .setValue(this.staffData.skillId, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtPreviousSchoolName'])
      .setValue(this.staffData.txtPreviousSchoolName, { onlySelf: true });
    (<FormControl>this.myForm.controls['txtPreviousSchoolAddress'])
      .setValue(this.staffData.txtPreviousSchoolAddress, { onlySelf: true });
    //  (<FormControl>this.myForm.controls['subjects'])
    //  .setValue(this.staffData.subjects, { onlySelf: true });
    (<FormControl>this.myForm.controls['experience'])
      .setValue(this.staffData.experience, { onlySelf: true });


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

    queryFilters.set('fields', 'id,group_name');
    this.dbService.query('cfg_group_default_views', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((groupname) => {
        this.groupname.push(GroupName.fromJson(groupname));
        this.log.consoleLog(this.groupname.length);
      });
      this.log.consoleLog(data);
    });




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
  }

  onClicktab(tabnumber) {
    this.select = tabnumber;
  }

  /**
   * On Addition of New Skill by removing existing skills
   */
  skillLimit: boolean = false;
  skillInsertArray: any[] = [];
  onAdditionOfSkills(skillid) {
    // this.log.consoleLog(this.testArray(skillid));
    this.validationOfSkill(skillid)
    this.log.consoleLog(this.result);
    //  this.log.consoleLog(skillid);
    // this.log.consoleLog(((this.skillDetailsOfPerticularTeacher.length) + (this.skillInsertArray.length)));
    if (((this.skillDetailsOfPerticularTeacher.length) + (this.skillInsertArray.length)) < 3) {
      if (this.result == false) {
        var skillName: string;
        this.skillInsertArray.push(this.skillInsertDoc(parseInt(skillid)));
        this.skills.filter((data) => {
          if (data.skillId == skillid) {
            skillName = data.skill_name;
          }
        });
        this.skillDetailsOfPerticularTeacher.push(this.skillPerticularTeacherDoc(skillName, parseInt(skillid), 0));
        this.skillLimit = false;
      }
      else {
        this.log.consoleLog("Data Already Present");

      }

    }
    else {
      this.skillLimit = true;
    }
  }

  /**
   * Validating skills on addition wheather the skill is already present or not in skills list
   */
  result: boolean;
  validationOfSkill(skillid) {
    this.result = false;
    this.log.consoleLog(skillid);
    this.log.consoleLog(this.skillDetailsOfPerticularTeacher);
    this.skillDetailsOfPerticularTeacher.filter((data) => {
      if (data.skillId == skillid) {
        this.log.consoleLog(data);
        this.result = true;
      }
    })

  }

  loginId: number;
  skillInsertDoc(_sub_code) {
    var doc = {

      sub_code: _sub_code,
      teacher_id: this.registrationId,
      created_by: this.loginId
    }
    return doc;
  }





  // On Remove of existing skill
  public removeSkillsOfStaff: any[] = new Array<TeacherSkilldetails>();
  onClickRemoveSkill(skilldata) {
    if (skilldata.row_id > 0) {
      this.removeSkillsOfStaff.push(skilldata);
    }

    if (this.skillInsertArray.length > 0) {
      this.skillInsertArray.splice(this.skillInsertArray.indexOf(this.skillInsertDoc(skilldata.skillId)), 1)
    }
    this.skillDetailsOfPerticularTeacher.splice(this.skillDetailsOfPerticularTeacher.indexOf(skilldata), 1);
    this.log.consoleLog(this.skillDetailsOfPerticularTeacher);
  }


  ///Group name validation
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



  generalUpdateDoc() {

    var doc = {
      intRegistrationId: this.registrationId,
      txtFirstName: this.myForm.getRawValue().txtFirstName,
      txtLastName: this.myForm.getRawValue().txtLastName,
      txtMiddleName: this.myForm.getRawValue().txtMiddleName,
      txtEmailId: this.myForm.getRawValue().txtEmailId,
      dtDOB: this.myForm.getRawValue().dtDOB,
      dtJoiningDate: this.myForm.getRawValue().dtJoiningDate,
      txtFatherName: this.myForm.getRawValue().txtFatherName,
      intGenderId: this.myForm.getRawValue().intGenderId,
      intmothertongueId: this.myForm.getRawValue().intmothertongueId,
      intReligionId: this.myForm.getRawValue().intReligionId,
      bloodGroup: this.myForm.getRawValue().bloodGroup,
      txtAadharNumber: this.myForm.getRawValue().txtAadharNumber,
      // txtNationality: this.myForm.getRawValue().txtNationality,
      // blBelongToBPL      :this.blBelongToBPL.value,
      // txtBPLCardNo       :this.txtBPLCardNo.value,
      // isDisabled         :this.disability.value,
      // intDisabilityId    :this.intDisabilityId.value,
      // intSocialCategoryId:this.intSocialCategoryId.value,

      txtLocality: this.myForm.getRawValue().txtLocality,
      // txtTaluk: this.myForm.getRawValue().txtFatherName,
      // txtDistrict: this.myForm.getRawValue().txtFatherName,
      // intStateId: this.myForm.getRawValue().txtFatherName,
      // user_type: this.myForm.getRawValue().txtFatherName,
      // intCityId: this.myForm.getRawValue().txtFatherName,
      // txtPincode: this.myForm.getRawValue().txtFatherName,
      txtPerAddress: this.myForm.getRawValue().txtPerAddress,
      txtTempAddress: this.myForm.getRawValue().txtTempAddress,
      group_name: this.myForm.getRawValue().group_name,
      // loginId: this.myForm.getRawValue().loginId
    }
    return doc;
  }

  staffUpdateDoc() {
    var doc = {
      txtMobileNumber: this.myForm.getRawValue().txtMobileNumber,
      txtRelativeNumber: this.myForm.getRawValue().txtRelativeNumber,
      txtAlternateMobileNumber: this.myForm.getRawValue().txtAlternateMobileNumber,
      qualification: this.myForm.getRawValue().qualification,
      designation: this.myForm.getRawValue().designation,
      // skillId: this.myForm.getRawValue().skillId,
      txtPreviousSchoolName: this.myForm.getRawValue().txtPreviousSchoolName,
      txtPreviousSchoolAddress: this.myForm.getRawValue().txtPreviousSchoolAddress,
      intRegistrationId: this.registrationId,
      intMaritalStatusId: this.myForm.getRawValue().intMaritalStatusId,
      experience: this.myForm.getRawValue().experience
    }
    return doc;
  }

  onClickUpdate() {

    this.log.consoleLog(this.generalUpdateDoc());
    this.log.consoleLog(this.staffUpdateDoc());
    var queryFilters = new URLSearchParams;
    queryFilters.set('filter', 'intRegistrationId= ' + this.registrationId);
    this.dbService.update('mst_registration', this.generalUpdateDoc(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);
      if (data.resource.length > 0) {
        this.notify.success("Success", data.resource.length + " Records Updated");
      }
    }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });

    queryFilters.set('filter', 'intRegistrationId= ' + this.registrationId);
    this.dbService.update('mst_staff', this.staffUpdateDoc(), queryFilters).subscribe((data) => {
      this.log.consoleLog(data);
    });

    if (this.skillInsertArray.length > 0) {
      this.dbService.insert('map_subj_teach', this.skillInsertArray).subscribe((data) => {
        this.log.consoleLog(data);
      });
    }


    // this.dbService.delete('map_subj_teach',this.removeSkillsOfStaff,'').subscribe((data)=>console.log("Deleted " + data));
    this.disableListOnclickTeacher = false;
  }

  onClickbackToList() {
    this.disableListOnclickTeacher = false;
  }

}
