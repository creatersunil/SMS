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

import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { UtilsService } from '../../../utils/utils.service';
import { Classes } from '../../../services';
import { Sections } from '../../../services';
import { Subjects } from './subjects';
import { ChartsModule, Color } from 'ng2-charts';


import { StudentsLengthof100Marks } from './studentsOf100Marks';
import { StudentsWrtClassSection } from '../list/studentsdetailsWrtClassSection';

import { MstExamNames } from './mst_exams';


//
import { StudentsMarksDetailsMongo } from './mongo-students-marks';
import { StudentMarks } from './class-students-marks-details';
import { ClassStudentsMarksDetailsMongo } from './class-students-marks-details';
import { StudentsFailedData } from './class-students-marks-details';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService],

})
export class ResultsComponent implements OnInit {
  public select: number = 1;
  public classes: any[] = new Array<Classes>();
  public sections: any[] = new Array<Sections>();
  public sectionNames: any[] = new Array<Sections>();
  public subjects: any[] = new Array<Subjects>();


  public studentsLengthOf100Marks: any[] = new Array<StudentsLengthof100Marks>();
  public mstExamTermsNames: any[] = new Array<MstExamNames>();
  public noOfStudentsInClass: number;
  public selected_class_id = 1;
  public subnames: any[] = [];
  public barColors: any = [];
  public pieChartData: any = [];
  public selectedClass: string;
  public selectedClassId: number;
  public selectedsection: string;
  public selectedSectionId: number;
  public selectedExamName: string = "";
  public studentDetails: any[] = new Array<StudentsWrtClassSection>();
  public enableCassSection: boolean = false;
  public enableChart: boolean = false;
  public pieChartDisable: boolean = false;

  ////Student Grading Data 
  public studentsGradingOnTotalMarks: any[] = new Array();
  public firstClassWithDistinctionStudentsLength: number;
  public firstClassStudentsLength: number;
  public secondClassStudentsLength: number;
  public justPassStudentsLength: number;


  constructor(private formBuilder: FormBuilder, private utilService: UtilsService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) { }

  ngOnInit() {
    this.onLoadData();
    // this.onLoadStudentsMarksDetails();

  }

  onClickSelectTab(tabNumber) {
    this.select = tabNumber;
  }
  //Charts
  // Pie
  public pieChartLabels: string[] = ['Pass', 'Fail'];
  public pieChartType: string = 'pie';
  public colors: Array<Color> = [{}];
  public datasets: any[] = [
    {
      data: this.pieChartData,
      backgroundColor: [
        "#5594c8",
        // "#d0021b",
        "#ec7949"
      ],
      hoverBackgroundColor: [
        "#5594c8",
        // "#d0021b",
        "#ec7949"
      ]
    }];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  //BAR CHART
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = this.subnames;
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartStudents100MarksList: any = [];
  public barChartData: any[] = [
    { data: this.barChartStudents100MarksList, label: 'Series A' },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];
  myColors = [{ backgroundColor: this.barColors }];
  //BAR CHART


  onLoadData() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'class_id,class_name');
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
        this.log.consoleLog(this.classes.length);
      });
    });


    queryFilters.set('fields', 'section_id,section_name');
    this.dbService.query('mst_sections', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((sections) => {
        this.sections.push(Sections.fromJson(sections));
      });
    });

    this.dbService.query('mst_exam_terms', '').subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((names) => {
        this.mstExamTermsNames.push(MstExamNames.fromJson(names));
      });
      // /this.onselectSection(this.selectedSectionId);
      this.log.consoleLog(this.mstExamTermsNames);

    });

  }


  onSelectExam(examName) {
    this.selectedExamName = examName;
    this.enableCassSection = true;
    this.log.consoleLog(this.selectedExamName);
  }
  /**
   * 
   * @param _class Selected Class Id
   * On Select class 
   */
  onClickClass(_class) {
    this.selectedClassId = _class;
    if (_class > 0) {
      this.classes.filter((viewdata) => {
        if (viewdata.class_id == _class) {
          this.selectedClass = viewdata.class_name;
        }
      });
      this.onLoadSubjectsWrtClass(_class);
    }
    else {
      this.selectedClass = "";
      this.selectedsection = "";
      // this.onLoadStudentsRecentlyRegistered();
    }
  }

  /**
   * 
   * @param class_id Selected Classs
   * To load the subjects which are allocated to perticular class
   */
  onLoadSubjectsWrtClass(class_id) {
    let param = [{
      "name": "class_id",
      "value": class_id,
    }];
    this.dbService.getDataFromProc('CLASS_SUBJECTS', param).subscribe((result) => {

      {
        this.subjects = [];
        result.resource.forEach((item) => {
          this.subjects.push(Subjects.fromJson(item));
        });
      }
      this.log.consoleLog(this.subjects);
    });
  }

  /**
   * 
   * @param _section Selected Section Id
   */
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
      this.loasClassTeacher(this.selectedClassId, this.selectedSectionId);
      this.onLoadStudentDetailsWRTclassSection(this.selectedClassId, this.selectedSectionId);
    }
  }

  /**
   * 
   * @param class_id selected class
   * @param section_id selected section id
   * Load the student details of perticular selected class and section
   */
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

        });
      }
      this.log.consoleLog(this.studentDetails);
      this.noOfStudentsInClass = this.studentDetails.length;
      this.loadStudentsMarksOfassSection();
    });
  }


  public classSectionTeacherName: string;
  loasClassTeacher(class_id, section_id) {
    let param = [{
      "name": "CLASS_ID",
      "value": class_id,
    },
    {
      "name": "SECTION_ID",
      "value": section_id,
    },
    ];
    this.dbService.getDataFromProc('CLASS_SECTION_TEACHER', param).subscribe((result) => {

      {
        this.log.consoleLog('result');
        this.log.consoleLog(result.resource[0]);
        this.classSectionTeacherName = result.resource[0].txtFirstName + ' ' + result.resource[0].txtLastName;
        this.log.consoleLog(this.classSectionTeacherName);
        this.log.consoleLog('result');
        // this.studentDetails = []
        // result.resource.forEach((item) => {
        //   this.studentDetails.push(StudentsWrtClassSection.fromJson(item));

        // });
      }
      // this.log.consoleLog(this.studentDetails);
      // this.noOfStudentsInClass = this.studentDetails.length;
      // this.loadStudentsMarksOfassSection();
    });
  }
  /**
   * 
   * @param Class_id selected class
   * load the sections WRT selected class
   */
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



  // marksDataOfStudents: any[] = new Array<StudentsMarksDetails>();
  // onLoadStudentsMarksDetails() {
  //   var queryHeaders = new URLSearchParams;
  //   this.dbService.queryMongo('marks', '', queryHeaders).subscribe((data) => {
  //     this.marksDataOfStudents = [];
  //     var data: any = data.json();
  //     data.resource.forEach((view) => {
  //       this.marksDataOfStudents.push(StudentsMarksDetails.fromJson(view));
  //     });
  //     this.log.consoleLog(this.marksDataOfStudents);
  //     this.log.consoleLog(this.marksDataOfStudents[0].exam_types[0].marks);
  //     this.dataSeparationOfStudentsMarks();
  //   });
  // }

  // absent = "Absent";
  // dataSeparationOfStudentsMarks() {
  //   this.marksDataOfStudents.filter((data) => {
  //     if (data.class_id == this.selected_class_id) {
  //       data.exam_types.filter((m_data) => {

  //         if (m_data.exam == "UNIT_TEST") {
  //           var totalmarks: number = 0;
  //           var totalMaxMarks: number = 0;
  //           for (var i = 0; i < m_data.marks.length; i++) {
  //             if (m_data.marks[i].obtained_marks !== this.absent) {
  //               totalmarks = totalmarks + m_data.marks[i].obtained_marks;

  //             }
  //             totalMaxMarks = totalMaxMarks + m_data.marks[i].max_marks;
  //           }
  //           this.log.consoleLog(totalmarks);
  //           this.log.consoleLog(totalMaxMarks);
  //           this.marksDetailsofStudentsOfClass.push(new ClassStudentsMarksDetails(data.class_id, data.section_id, data.student_id, m_data.exam, m_data.marks, totalmarks, totalMaxMarks));
  //           m_data.marks.filter((mark_students_data) => {
  //             if ((mark_students_data.obtained_marks < mark_students_data.passing_marks || (mark_students_data.obtained_marks == this.absent))) {
  //               this.studentsFailedList.push(new ClassStudentsMarksDetails(data.class_id, data.section_id, data.student_id, m_data.exam, mark_students_data, totalmarks, totalMaxMarks));
  //             }

  //             if (mark_students_data.obtained_marks == mark_students_data.max_marks) {
  //               this.studentsOf100MarksInSubjects.push(new StudentsDetailsOf100Marks(data.student_id, mark_students_data.subject_id, mark_students_data.subject_name))
  //             }
  //             // this.log.consoleLog(m_data.marks.length)

  //           });

  //         }
  //       })
  //     }
  //   })
  //   // this.studentsLengthOf100Marks = _.cloneDeep(this.studentsOf100MarksInSubjects)
  //   for (var i = 0; i < this.marksDataOfStudents[0].exam_types[0].marks.length; i++) {
  //     var count = 0;
  //     this.studentsOf100MarksInSubjects.filter((stdata) => {

  //       if (stdata.subject_id == this.marksDataOfStudents[0].exam_types[0].marks[i].subject_id) {
  //         count = count + 1;
  //         this.studentsLengthOf100Marks.push(new StudentsLengthof100Marks(stdata.subject_id, stdata.subject_name, count));
  //       }
  //     })
  //   }
  //   this.studentsLengthOf100Marks = this.utilService.removeDulpicates(this.studentsLengthOf100Marks, 'subject_id');
  //   this.studentsLengthOf100Marks.filter((data) => {
  //     this.subjects.push(data);
  //   });
  //   this.subjects = this.utilService.removeDulpicates(this.subjects, 'subject_id');
  //   // this.pieChartData.push((this.marksDetailsofStudentsOfClass.length) - (this.studentsFailedList.length), this.studentsFailedList.length);
  //   this.log.consoleLog(this.marksDetailsofStudentsOfClass);
  //   this.log.consoleLog(this.marksDataOfStudents[0].exam_types[0].marks.length);
  //   this.log.consoleLog(this.studentsFailedList);
  //   this.log.consoleLog(this.studentsFailedList.length);

  //   this.log.consoleLog(this.pieChartData);
  //   this.log.consoleLog(this.studentsOf100MarksInSubjects);
  //   this.log.consoleLog(this.studentsLengthOf100Marks);
  //   this.log.consoleLog(this.subjects);

  //   this.log.consoleLog(this.subjects);

  //   // Push data to barchart 
  //   for (var i = 0; i < this.subjects.length; i++) {
  //     this.subnames.push(this.subjects[i].subject_name);
  //     this.barChartStudents100MarksList.push(this.subjects[i].stcount);
  //     this.barColors.push('#5594c8');
  //   }
  //   this.log.consoleLog(this.subnames);
  //   this.log.consoleLog(this.barChartStudents100MarksList);
  //   // this.enableChart = true;
  // }

  /**
   * Load the data from Mongo DB for perticular selected class and section and exam_type
   */
  public marksDataOfStudentsMongo: any[] = new Array<StudentsMarksDetailsMongo>();
  loadStudentsMarksOfassSection() {
    if (this.selectedClassId > 0 && this.selectedSectionId > 0 && this.selectedExamName != "") {
      var queryHeaders = new URLSearchParams;
      queryHeaders.set('filter', '(exam =' + this.selectedExamName + ') AND (class_id =' + this.selectedClassId + ') AND (section_id =' + this.selectedSectionId + ')')
      this.dbService.queryMongo('marks', '', queryHeaders).subscribe((data) => {
        this.marksDataOfStudentsMongo = [];
        var data: any = data.json();
        data.resource.forEach((view) => {
          this.marksDataOfStudentsMongo.push(StudentsMarksDetailsMongo.fromJson(view));
        });
        this.log.consoleLog(this.marksDataOfStudentsMongo);
        this.onMapStudentsMarksWRTStdId();
      });
    }
    else {
      this.log.consoleLog("Select exam");
    }
  }

  /**
   * segrigate the obtained data based on student registrationid and subject
   */
  public failedStudentsLength: number;
  public studentsFailedData: any[] = new Array<StudentsFailedData>();
  public studentClassSectionMarksData: any[] = new Array<ClassStudentsMarksDetailsMongo>();
  onMapStudentsMarksWRTStdId() {
    this.studentClassSectionMarksData = [];
    this.studentDetails.filter((stdata) => {
      var subjectMarks = [];
      var totalObtainedMarks: number = 0;
      var totalConductedMarks: number = 0;
      var studentPassFailStatus: string = this.utilService.marksPassStatus;
      // allocate default marks to subjects
      this.subjects.filter((subdata) => {
        subjectMarks.push(new StudentMarks(subdata.subject_id, subdata.subject_name, '', '', '', ''));
      })
      // filter the marks data obtained from mongo db and push to subjectMarks Array if subject id present
      this.marksDataOfStudentsMongo.filter((data) => {
        if (stdata.intRegistrationId == data.student_id) {
          // Condition to check Absent Or Present If Absent Not add marks to  total
          if (data.obtained_marks != this.utilService.attendanceAbStatus) {
            totalObtainedMarks = totalObtainedMarks + data.obtained_marks;
          }

          //  collect the total conducted marks
          totalConductedMarks = totalConductedMarks + data.max_marks;
          subjectMarks.push(new StudentMarks(data.subject_id, data.subject_name, data.max_marks, data.passing_marks, data.obtained_marks, data.exam_date));

          // Failed Students Data
          if (data.obtained_marks == this.utilService.attendanceAbStatus || data.obtained_marks < data.passing_marks) {
            studentPassFailStatus = this.utilService.marksFailStatus;
            this.studentsFailedData.push(new StudentsFailedData(stdata.intRegistrationId, data.subject_id, data.obtained_marks, data.passing_marks))
          }
        }
      });
      // Remove the duplicates data in subject array if present for same subject Id
      subjectMarks = this.utilService.removeDulpicates(subjectMarks, 'subject_id');
      this.studentsFailedData = this.utilService.removeDulpicates(this.studentsFailedData, 'intRegistrationId');
      // push the segrigated  Marks details  students with his general details
      this.studentClassSectionMarksData.push(new ClassStudentsMarksDetailsMongo(stdata.intRegistrationId, stdata.txtFirstName, stdata.txtLastName, totalObtainedMarks, totalConductedMarks, studentPassFailStatus, subjectMarks));
      // this.failedStudentsLength = this.studentsFailedData.length;
    })

    // Call the function to segrigate  toppers and who got full marks
    /////////////////////////////////////////////
    this.onLoadStudentsOfFullMarksAndToppersList();
    ////////////////////////////////////////////////

    this.log.consoleLog(this.studentsFailedData);
    this.log.consoleLog(this.studentClassSectionMarksData);
    // Data Asign to pie chart
    this.pieChartData[0] = ((this.studentDetails.length) - (this.studentsFailedData.length));
    this.pieChartData[1] = this.studentsFailedData.length;
    this.pieChartDisable = true;
    this.log.consoleLog(this.pieChartData);
  }





  /**
   * to get the length of students who got full marks in subjects
   */
  arDataForFullMarks: any[] = new Array<StudentsLengthof100Marks>();
  arDataForTop10Studnets: any[] = new Array();
  onLoadStudentsOfFullMarksAndToppersList() {
    this.subjects.filter((data) => {
      var count: number = 0;
      this.arDataForFullMarks.push(new StudentsLengthof100Marks(data.subject_id, data.subject_name, 0));

      this.marksDataOfStudentsMongo.filter((fullmarksdata) => {
        if (data.subject_id == fullmarksdata.subject_id && fullmarksdata.obtained_marks == fullmarksdata.max_marks) {
          count = count + 1;
        }
      })
      this.arDataForFullMarks.push(new StudentsLengthof100Marks(data.subject_id, data.subject_name, count));

    })
    this.arDataForFullMarks = this.utilService.removeDulpicates(this.arDataForFullMarks, 'subject_id');
    this.log.consoleLog(this.arDataForFullMarks);

    // Data Assigning to bar chart of students who scored full marks
    for (var i = 0; i < this.arDataForFullMarks.length; i++) {
      this.subnames[i] = this.arDataForFullMarks[i].subject_name;
      this.barChartStudents100MarksList[i] = this.arDataForFullMarks[i].stcount;
      this.barColors[i] = this.utilService.primaryColor;
    }
    this.log.consoleLog(this.subnames);
    this.log.consoleLog(this.barChartStudents100MarksList);
    this.log.consoleLog(this.barColors);
    this.enableChart = true;

    // Arrange the students with their heighest marks by sorting
    this.studentClassSectionMarksData.sort(function (a, b) {
      return parseFloat(b.totalMarks) - parseFloat(a.totalMarks);
    });
    this.log.consoleLog(this.studentClassSectionMarksData);
    if (this.studentClassSectionMarksData.length > 10) {
      for (var i = 0; i < 10; i++) {
        this.arDataForTop10Studnets.push(this.studentClassSectionMarksData[i]);
      }
    }
    else {
      for (var i = 0; i < this.studentClassSectionMarksData.length; i++) {
        this.arDataForTop10Studnets.push(this.studentClassSectionMarksData[i]);
      }
    }

    this.log.consoleLog(this.arDataForTop10Studnets);
    this.onLoadGradeOfStudentsBasedOnMarks();
  }


  onLoadGradeOfStudentsBasedOnMarks() {
    this.log.consoleLog("Praj");
    this.studentsGradingOnTotalMarks = _.cloneDeep(this.studentClassSectionMarksData);
    this.log.consoleLog(this.studentsGradingOnTotalMarks);
    this.log.consoleLog("Prak");

    this.studentsFailedData.filter((data) => {
      this.studentsGradingOnTotalMarks.filter((markData) => {
        if (data.intRegistrationId == markData.intRegistrationId) {
          this.studentsGradingOnTotalMarks.splice(this.studentsGradingOnTotalMarks.indexOf(markData), 1);
          // this.log.consoleLog(this.studentsGradingOnTotalMarks);
        }
      })
    })
    this.log.consoleLog("Praveeee");
    this.log.consoleLog(this.studentsGradingOnTotalMarks);
    this.log.consoleLog("Pravee");
    this.firstClassWithDistinctionStudentsLength = 0;
    this.firstClassStudentsLength = 0;
    this.secondClassStudentsLength = 0;
    this.justPassStudentsLength = 0;
    this.failedStudentsLength = 0;
    this.studentsGradingOnTotalMarks.filter((gradedata) => {
      if (gradedata.totalMarks > this.utilService.firstClassWithDistinction && gradedata.passFailStatus == this.utilService.marksPassStatus) {
        this.firstClassWithDistinctionStudentsLength = this.firstClassWithDistinctionStudentsLength + 1;
      }
      else if (gradedata.totalMarks > this.utilService.firstClass && gradedata.totalMarks < this.utilService.firstClassWithDistinction && gradedata.passFailStatus == this.utilService.marksPassStatus) {
        this.firstClassStudentsLength = this.firstClassStudentsLength + 1;
      }
      else if (gradedata.totalMarks > this.utilService.sectondClass && gradedata.totalMarks < this.utilService.firstClass && gradedata.passFailStatus == this.utilService.marksPassStatus) {
        this.secondClassStudentsLength = this.secondClassStudentsLength + 1;
      }
      else if (gradedata.totalMarks < this.utilService.sectondClass && gradedata.totalMarks > this.utilService.passMarks && gradedata.passFailStatus == this.utilService.marksPassStatus) {
        this.justPassStudentsLength = this.justPassStudentsLength + 1;
      }
      else {
        this.failedStudentsLength = this.failedStudentsLength + 1
      }
    });
    this.log.consoleLog(this.firstClassWithDistinctionStudentsLength);
    this.log.consoleLog(this.firstClassStudentsLength);
    this.log.consoleLog(this.secondClassStudentsLength);
    this.log.consoleLog(this.justPassStudentsLength);
  }
}