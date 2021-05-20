import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

// import classes
import { DbService, Logs, UserConfig } from '../../../../services';
import { UtilsService } from '../../../../utils/utils.service';
import { Classes, Sections, Subjects } from '../../../../services';

import { ClassSubject } from '../class_subject';
import { ClassSubjectData } from './class_subject_data';

import { ClassSectionData } from './class_section';
import { ClassSectionDataImplementation } from './class_section_data_implementation';

import { RegistrationLoadType } from './registrationtableload';
import { ClassSectionTeacher } from './class_section-teacher';
// import { JsonClassSectionTeacher } from './json_class_section_teacher_data';

// 
import { ClassSectionTeacherDataCls } from './json_class_section_teacher_data';

import { SnotifyService, SnotifyPosition, SnotifyModule, SnotifyToast } from 'ng-snotify';

@Component({
  selector: 'app-class-subject-teacher',
  templateUrl: './class-subject-teacher.component.html',
  styleUrls: ['./class-subject-teacher.component.scss'],
  providers: [DbService, Logs, UserConfig, UtilsService]
})
export class ClassSubjectTeacherComponent implements OnInit, OnDestroy {

  editMode1: boolean = false;
  editMode2: boolean = false;
  editMode3: boolean = false;
  select: number = 1;
  enabled = 1;

  subjects = [];
  classes = [];
  sections = [];
  classSubject = [];
  classSubjectData = [];
  classSectionData = [];
  groupClassSubjects = [];
  uniqueArraySubjects = [];
  insertClassSubjectData = [];
  updatClassSubjectData = [];
  loginId: any;
  ngOnDestroy() {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.log.consoleLog("destroyed");
    this.classSectionData = null;
    this.classSubjectData = null;
    this.subjects = null;
    this.classes = null;
    this.sections = null;
    this.classSubject = null;
    this.groupClassSubjects = null;
    this.uniqueArraySubjects = null;
    this.insertClassSubjectData = null;
    this.updatClassSubjectData = null;
    this.loadRegidName = null;
    this.groupClassSectionData = null;
    // this.classSectionTeacherData = null;
    // this.groupclassSectionTeacherData = null;

  }
  constructor(private formBuilder: FormBuilder,
    private router: Router, private log: Logs, private userConfig: UserConfig,
    private dbService: DbService, private renderer: Renderer, private utilService: UtilsService, private notify: SnotifyService) { }

  ngOnInit() {
    this.notify.setConfig({
      timeout: 3000,

      showProgressBar: false
    }, {
        newOnTop: false,

      });
    this.onLoadSubjects();
    // this.onLoadClasses();
    this.onLoadSections();
    this.loadClassSubjectdata();
    this.loginId = this.userConfig.getRegId();
    this.onLoadClassSectionData();
    this.loadStaffDetails();
    this.onLoadClassSectionTeacher();
  }

  onClickSelectTab(tabNumber) {
    this.select = tabNumber;
  }




  /**
   * CLASS SUBJECT DATA CODE
   */
  onClassSubjectEdit(tabNumber) {
    this.editMode1 = true;
  }
  onClassSubjectCancel() {
    this.editMode1 = false;
  }

  onLoadSubjects() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'subject_enabled =' + this.enabled)
    queryFilters.set('fields', 'subject_id,subject_name,subject_enabled');

    this.dbService.query('mst_subjects', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((subjects) => {
        this.subjects.push(Subjects.fromJson(subjects));

      });

    });



    queryFilters.set('filter', 'class_enabled =' + this.enabled)
    queryFilters.set('fields', 'class_id,class_name,class_enabled');

    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));

      });

    });

  }



  onLoadSections() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'section_id,section_name');

    this.dbService.query('mst_sections', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((sections) => {
        this.sections.push(Sections.fromJson(sections));

      });

    })
    this.log.consoleLog(this.sections);
  }



  /**
   * map class subject data
   */
  loadClassSubjectdata() {

    this.dbService.getDataFromProc('getClassSubjectData', '').subscribe((result) => {

      {

        let pri_class_id: any;
        let pri_class: any;

        result.resource.forEach((item) => {
          let clsSub = ClassSubject.fromJson(item);
          if (clsSub.class_id != pri_class_id && pri_class_id != undefined) {
            this.log.consoleLog("Add data to group");
            var doc = {
              class_name: pri_class.class_name,
              subjects: this.classSubjectData
            }
            this.groupClassSubjects.push(ClassSubjectData.fromJson(doc));
            //reset the data
            this.classSubjectData = [];
          }
          this.classSubjectData.push(clsSub);
          pri_class_id = clsSub.class_id;
          pri_class = clsSub;

        });

        // add last record to groupData
        var doc = {
          class_name: pri_class.class_name,
          subjects: this.classSubjectData
        }
        this.groupClassSubjects.push(ClassSubjectData.fromJson(doc));
        this.classSubjectData = [];

      }

      this.log.consoleLog(this.groupClassSubjects);

    });


  }


  /**
   *    Check or uncheck for enabling no of subjects in pericular 
   * class row_id, event, class_id, sub_id, group
   * @param row_id 
   * @param event 
   * @param class_id 
   * @param sub_id 
   * @param group 
   */
  onChangeClassSubjectStatus(subject) {


    this.log.consoleLog(subject.row_id);
    if (subject.row_id > 0) {
      this.updatClassSubjectData.push(this.resultUpdateDataData(subject.row_id, subject.class_id, subject.subject_id, subject.subject_isActive));
      this.updatClassSubjectData = this.utilService.removeDulpicates(this.updatClassSubjectData, 'row_id');
    }
    else {
      this.insertClassSubjectData.push(this.resultInsertDataData(subject.class_id, subject.subject_id, subject.subject_isActive, subject.unique_num));
      this.insertClassSubjectData = this.utilService.removeDulpicates(this.insertClassSubjectData, 'unique_num');
    }

    this.log.consoleLog(this.updatClassSubjectData);
    this.log.consoleLog(this.insertClassSubjectData);
  }


  /**
   *   doc to update the existing records
   * @param _row_id 
   * @param _class_id 
   * @param _subject_id 
   * @param _subject_isActive 
   */
  resultUpdateDataData(_row_id, _class_id, _subject_id, _subject_isActive) {
    var doc = {
      row_id: _row_id,
      class_id: _class_id,
      subject_id: _subject_id,
      subject_isActive: _subject_isActive,
      created_by: this.loginId,

    }
    return doc;
  }



  /**
   *   Doc to insert data if not present in database
   * @param _class_id 
   * @param _subject_id 
   * @param _subject_isActive 
   */
  resultInsertDataData(_class_id, _subject_id, _subject_isActive, _unique_num) {
    var doc = {
      class_id: _class_id,
      subject_id: _subject_id,
      subject_isActive: _subject_isActive,
      created_by: this.loginId,
      unique_num: _unique_num
    }
    return doc;
  }



  /**
  * 
  * @param  SAVE DATA TO DATABASE
  */
  onClassSubjectSave() {
    this.log.consoleLog('Ok');
    if (this.updatClassSubjectData.length > 0) {
      this.dbService.update('map_class_subject', this.updatClassSubjectData, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
        }
        this.log.consoleLog(data);
        this.updatClassSubjectData = [];
        // this.editMode1 = false;
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

    if (this.insertClassSubjectData.length > 0) {
      this.dbService.insert('map_class_subject', this.insertClassSubjectData).subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Inserted");
        }
        this.log.consoleLog(data);
        this.insertClassSubjectData = [];

      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }
    this.editMode1 = false;
  }





  //////////////////ClassSubject Ends
  ////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////ClassSections starts
  ////////////////////////////////////////////////////////////




  /**
   * 
   * @param CLASS SECTION STRENGTH DATA CODE
   */
  onClassSectionEdit(tabNumber) {
    this.editMode2 = true;
  }


  /** map array with respect to class section and its strength
   * 
   */
  groupClassSectionData = []
  onLoadClassSectionData() {
    this.dbService.getDataFromProc('map_class_section', '').subscribe((result) => {
      {

        let pri_class_id: any;
        let pri_class: any;
        let pri_class_with_data: any;
        let count: number = 0;

        result.resource.forEach((item) => {
          let clsSec = ClassSectionData.fromJson(item);
          count++;
          if (clsSec.class_id != pri_class_id && pri_class_id != undefined) {
            this.log.consoleLog("Add data to group");
            var doc = {
              class_name: pri_class_with_data.class_name,
              total_strength: pri_class_with_data.total_strength,
              no_of_sections: pri_class_with_data.no_of_sections,
              sections: this.classSectionData
            }
            this.groupClassSectionData.push(ClassSectionDataImplementation.fromJson(doc));
            //reset the data
            this.classSectionData = [];
            count = 0;
          }
          this.classSectionData.push(clsSec);
          if (clsSec.row_id > 0) {  // > 0 indicates that we have proper data       
            pri_class_with_data = clsSec;
          }
          else if (count < 2) {
            pri_class_with_data = clsSec;
          }
          pri_class_id = clsSec.class_id;
          pri_class = clsSec;

        });

        // add last record to groupData
        var doc = {
          class_name: pri_class_with_data.class_name,
          total_strength: pri_class_with_data.total_strength,
          no_of_sections: pri_class_with_data.no_of_sections,
          sections: this.classSectionData
        }
        this.groupClassSectionData.push(ClassSectionDataImplementation.fromJson(doc));
        this.classSectionData = [];

      }

      this.log.consoleLog(this.groupClassSectionData);
      //this.log.consoleLog(this.classSectionData);
    });
  }



  /**
   * on changing the strength of class
   */
  classSectionTotalStrenghDataChange = [];
  onClassSectionStengthChange(group) {
    var _class_id: any;
    this.classes.filter(_classdata => {
      if (_classdata.class_name == group.class_name) {
        _class_id = _classdata.class_id;
      }
    })

    this.classSectionTotalStrenghDataChange.push(this.onClassSectionStrengthChangeDoc(_class_id, group.total_strength));
    this.classSectionTotalStrenghDataChange = this.utilService.removeDulpicates(this.classSectionTotalStrenghDataChange, 'class_id')
    this.log.consoleLog(this.classSectionTotalStrenghDataChange);

  }


  onClassSectionStrengthChangeDoc(_class, strength) {
    var doc = {
      class_id: _class,
      total_strength: strength
    }
    return doc;
  }



  classSectionSectionLengthdataArray = [];
  onClassSectionLengthChange(group) {
    var _class_id: any;
    this.classes.filter(_classdata => {
      if (_classdata.class_name == group.class_name) {
        _class_id = _classdata.class_id;
      }
    });
    // this.log.consoleLog(no_of_sections);
    // this.log.consoleLog(_class);
    // this.log.consoleLog(_class_id);
    // this.log.consoleLog(this.onClassSectionLengthChangeDoc(_class_id,no_of_sections));
    this.classSectionSectionLengthdataArray.push(this.onClassSectionLengthChangeDoc(_class_id, group.no_of_sections));
    this.classSectionSectionLengthdataArray = this.utilService.removeDulpicates(this.classSectionSectionLengthdataArray, 'class_id')
    this.log.consoleLog(this.classSectionSectionLengthdataArray);
  }

  onClassSectionLengthChangeDoc(_class_id, no_of_sections) {
    var doc = {
      class_id: _class_id,
      no_of_sections: no_of_sections
    }
    return doc;
  }


  classSectionSectionStrengthUpdateData = [];
  classSectionSectionStrengthInsertData = [];
  //row_id, secStr, class_id, sec_id
  onSectionStrengthChange(sectionStrength) {
    // this.log.consoleLog(sectionStrength.std_count);
    // this.log.consoleLog(sectionStrength.row_id);
    // this.log.consoleLog(sectionStrength.class_id);
    // this.log.consoleLog(sectionStrength.section_id);
    if (sectionStrength.row_id > 0) {
      this.classSectionSectionStrengthUpdateData.push(this.onSectionStrengthUpdateChangeDoc(sectionStrength.row_id, sectionStrength.std_count, sectionStrength.class_id, sectionStrength.section_id));
      this.classSectionSectionStrengthUpdateData = this.utilService.removeDulpicates(this.classSectionSectionStrengthUpdateData, 'row_id');
      this.log.consoleLog(this.classSectionSectionStrengthUpdateData);
    }
    else {
      this.classSectionSectionStrengthInsertData.push(this.onSectionStrengthInsertChangeDoc(sectionStrength.std_count, sectionStrength.class_id, sectionStrength.section_id, sectionStrength.unique_num));
      this.classSectionSectionStrengthInsertData = this.utilService.removeDulpicates(this.classSectionSectionStrengthInsertData, 'unique_num')
      this.log.consoleLog(this.classSectionSectionStrengthInsertData);
    }
  }

  onSectionStrengthUpdateChangeDoc(_row_id, secStr, _class_id, sec_id) {
    var doc = {
      row_id: _row_id,
      class_id: _class_id,
      section_id: sec_id,
      std_count: secStr
    }
    return doc;
  }
  onSectionStrengthInsertChangeDoc(secStr, _class_id, sec_id, _unique_num) {
    var doc = {
      class_id: _class_id,
      section_id: sec_id,
      std_count: secStr,
      unique_num: _unique_num
    }
    return doc;
  }


  onClassSectionSave(tabNumber) {


    if (this.classSectionSectionStrengthUpdateData.length > 0) {
      this.dbService.update('map_csct', this.classSectionSectionStrengthUpdateData, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
        }
        this.log.consoleLog(data);
        this.classSectionSectionStrengthUpdateData = [];
        this.editMode2 = false;
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

    if (this.classSectionSectionStrengthInsertData.length > 0) {
      this.dbService.insert('map_csct', this.classSectionSectionStrengthInsertData).subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Inserted");
        }
        this.log.consoleLog(data);
        this.classSectionSectionStrengthInsertData = [];
        this.editMode2 = false;
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }


    if (this.classSectionTotalStrenghDataChange.length > 0) {
      this.dbService.update('mst_classes', this.classSectionTotalStrenghDataChange, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
        }
        this.log.consoleLog(data);
        this.classSectionTotalStrenghDataChange = [];
        this.editMode2 = false;
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

    if (this.classSectionSectionLengthdataArray.length > 0) {
      this.dbService.update('mst_classes', this.classSectionSectionLengthdataArray, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
        }
        this.log.consoleLog(data);
        this.classSectionSectionLengthdataArray = [];
        this.editMode2 = false;
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

  }



  onClassSectionCancel(tabNumber) {
    this.editMode2 = false;
    this.classSectionSectionLengthdataArray = [];
    this.classSectionTotalStrenghDataChange = [];
    this.classSectionSectionStrengthInsertData = [];
    this.classSectionSectionStrengthUpdateData = [];
  }



  ///////////////////////////////////////////////////////////////
  //////////////////////////////////CLASS SECTION TEACHER STARTS
  /**
   * 
   * @param CLASS TEACHER DATA CODE
   */
  onClassTeacherEdit(tabNumber) {
    this.editMode3 = true;
  }




  calculateRowSpan(data) {
    alert(data);
    return 3;
  }


  loadRegidName = [];
  loadStaffDetails() {

    this.dbService.getDataFromProc('mstStaffRecords', '').subscribe((result) => {

      {

        result.resource.forEach((item) => {
          this.loadRegidName.push(RegistrationLoadType.fromJson(item));

        });
      }
      this.log.consoleLog(this.loadRegidName);

    });

  }

  public teacherData: any[] = new Array<ClassSectionTeacher>();
  public duplicateTeacherData: any[] = new Array<ClassSectionTeacher>();
  // classSectionTeacherData = [];
  // groupclassSectionTeacherData = [];
  onLoadClassSectionTeacher() {

    this.dbService.getDataFromProc('map_class_section_teacher', '').subscribe((result) => {

      {

        {
          result.resource.forEach((item) => {
            this.teacherData.push(ClassSectionTeacher.fromJson(item));
          });
        }
        // this.classTeacherSeparateionData();
        this.fcnClassSectionTeacher();
        this.log.consoleLog(this.teacherData);
        this.duplicateTeacherData = _.cloneDeep(this.teacherData);


        // let pri_class_id: any;
        // let pri_class: any;

        // result.resource.forEach((item) => {
        //   let clsSub = ClassSectionTeacher.fromJson(item);
        //   if (clsSub.class_id != pri_class_id && pri_class_id != undefined) {
        //     this.log.consoleLog("Add data to group");
        //     var doc = {
        //       class_name: pri_class.class_name,
        //       sectionteacher: this.classSectionTeacherData
        //     }
        //     this.groupclassSectionTeacherData.push(JsonClassSectionTeacher.fromJson(doc));
        //     //reset the data
        //     this.classSectionTeacherData = [];
        //   }
        //   this.classSectionTeacherData.push(clsSub);
        //   pri_class_id = clsSub.class_id;
        //   pri_class = clsSub;

        // });

        // // add last record to groupData
        // var doc = {
        //   class_name: pri_class.class_name,
        //   sectionteacher: this.classSectionTeacherData
        // }
        // this.groupclassSectionTeacherData.push(JsonClassSectionTeacher.fromJson(doc));
        // this.classSectionTeacherData = [];

      }
      // this.log.consoleLog(this.groupclassSectionTeacherData);

    });
  }

  // classTeacherSeparateionData() {
  //   this.log.consoleLog("PRA");
  //   var t0 = performance.now();
  //   this.log.consoleLog(t0);
  //   this.log.consoleLog("PRA");
  //   let pri_class_id: any;
  //   let pri_class: any;
  //   this.teacherData.forEach((item) => {
  //     let clsSub = ClassSectionTeacher.fromJson(item);
  //     if (clsSub.class_id != pri_class_id && pri_class_id != undefined) {
  //       this.log.consoleLog("Add data to group");
  //       var doc = {
  //         class_name: pri_class.class_name,
  //         sectionteacher: this.classSectionTeacherData
  //       }
  //       this.groupclassSectionTeacherData.push(JsonClassSectionTeacher.fromJson(doc));
  //       //reset the data
  //       this.classSectionTeacherData = [];
  //     }
  //     this.classSectionTeacherData.push(clsSub);
  //     pri_class_id = clsSub.class_id;
  //     pri_class = clsSub;

  //   });
  //   this.log.consoleLog("PRAV");
  //   var t1 = performance.now();
  //   this.log.consoleLog("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  //   this.log.consoleLog("PRAV");
  //   // add last record to groupData
  //   var doc = {
  //     class_name: pri_class.class_name,
  //     sectionteacher: this.classSectionTeacherData
  //   }
  //   this.groupclassSectionTeacherData.push(JsonClassSectionTeacher.fromJson(doc));
  //   this.classSectionTeacherData = [];
  //   this.log.consoleLog(this.groupclassSectionTeacherData);
  // }



  classSectionTeacherUpdateData = [];
  classSectionTeacherInsertData = [];
  //teacher, sec, classdata, row_id, remarks
  onSelectClassTeacher(classTeacher, teacher_id) {
    var teacherFirstname: string;
    var teacherLastname: string;

    this.loadRegidName.filter((data) => {
      if (data.intRegistrationId == teacher_id) {
        teacherFirstname = data.txtFirstName;
        teacherLastname = data.txtLastName;
      }
    })

    this.log.consoleLog(classTeacher.row_id);
    this.teacherData.push(new ClassSectionTeacher(
      classTeacher.row_id, classTeacher.class_id, classTeacher.class_name, parseInt(teacher_id), classTeacher.section_id, classTeacher.section_name, classTeacher.std_count, classTeacher.remarks, teacherFirstname, teacherLastname, classTeacher.unique_num));
    this.teacherData = this.utilService.removeDulpicates(this.teacherData, 'unique_num');
    this.log.consoleLog(this.teacherData);

    if (classTeacher.row_id > 0) {

      this.classSectionTeacherUpdateData.push(this.onUpdateClassTeacherDoc(classTeacher.row_id, classTeacher.section_id, classTeacher.class_id, parseInt(teacher_id), classTeacher.remarks));
      this.classSectionTeacherUpdateData = this.utilService.removeDulpicates(this.classSectionTeacherUpdateData, "row_id");
      this.log.consoleLog(this.classSectionTeacherUpdateData);
    }
    else {
      if (parseInt(teacher_id) > 0)
        this.classSectionTeacherInsertData.push(this.onInsertClassTeacherDoc(classTeacher.section_id, classTeacher.class_id, parseInt(teacher_id), classTeacher.remarks, classTeacher.unique_num));
      this.classSectionTeacherInsertData = this.utilService.removeDulpicates(this.classSectionTeacherInsertData, 'unique_num')
      this.log.consoleLog(this.classSectionTeacherInsertData);
    }

  }

  onInsertClassTeacherDoc(_section_id, _class_id, _teacher_id, _remarks, _unique_num) {
    var doc = {
      created_by: this.loginId,
      // row_id: _row_id,
      section_id: _section_id,
      class_id: _class_id,
      teacher_id: _teacher_id,
      remarks: _remarks,
      unique_num: _unique_num,
    }
    return doc;
  }

  onUpdateClassTeacherDoc(_row_id, _section_id, _class_id, _teacher_id, _remarks) {
    var doc = {
      created_by: this.loginId,
      row_id: _row_id,
      section_id: _section_id,
      class_id: _class_id,
      teacher_id: _teacher_id,
      remarks: _remarks
    }
    return doc;
  }

  // removeDulpicates(originalArray, prop) {
  //   var newArray = [];
  //   var lookupObject = {};

  //   for (var i in originalArray) {
  //     lookupObject[originalArray[i][prop]] = originalArray[i]
  //   }
  //   for (i in lookupObject) {
  //     newArray.push(lookupObject[i]);
  //   }
  //   return newArray;
  // }





  onClassTeacherSave() {
    // this.editMode3 = false;
    // this.log.consoleLog(this.classSectionTeacherData);
    // this.log.consoleLog(this.groupclassSectionTeacherData);
    this.log.consoleLog(this.teacherData);
    // this.groupclassSectionTeacherData = [];
    // this.classSectionTeacherData = [];
    // this.classTeacherSeparateionData();
    this.fcnClassSectionTeacher();
    this.log.consoleLog(this.classSectionTeacherUpdateData);
    if (this.classSectionTeacherUpdateData.length > 0) {
      this.dbService.update('map_csct', this.classSectionTeacherUpdateData, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
        }
        this.log.consoleLog(data);

        this.classSectionTeacherUpdateData = [];

      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

    if (this.classSectionTeacherInsertData.length > 0) {
      this.dbService.insert('map_csct', this.classSectionTeacherInsertData).subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Inserted");
        }
        this.log.consoleLog(data);
        this.classSectionTeacherInsertData = [];

      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

    this.editMode3 = false;
  }




  onClassTeacherCancel(tabNumber) {
    this.teacherData = this.duplicateTeacherData;
    this.fcnClassSectionTeacher();
    this.editMode3 = false;
    this.classSectionTeacherInsertData = [];
    this.classSectionTeacherUpdateData = [];
  }


  classSectTeacherSegrigatedData: any[] = new Array<ClassSectionTeacherDataCls>();
  fcnClassSectionTeacher() {

    this.log.consoleLog("PRAVEEN111");
    var t0 = performance.now();
    this.log.consoleLog(t0);
    this.log.consoleLog("PRAVEEN111");
    this.classSectTeacherSegrigatedData = [];
    this.classes.filter((classData) => {
      var arClasTeacher: any[] = [];
      this.teacherData.filter((teacherdata) => {
        if (classData.class_id == teacherdata.class_id) {
          arClasTeacher.push(teacherdata);
        }
      });
      this.classSectTeacherSegrigatedData.push(new ClassSectionTeacherDataCls(classData.class_name, arClasTeacher));
    })
    this.log.consoleLog("PRAVEEN23");
    var t1 = performance.now();
    this.log.consoleLog("Call to doSomething took " + (t1 - t0) + " milliseconds.");
    this.log.consoleLog("PRAVEEN23");
    this.log.consoleLog("PRAVEEN");
    this.log.consoleLog(this.classSectTeacherSegrigatedData);
    this.log.consoleLog("PRAVEEN");
  }

}
