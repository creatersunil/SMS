import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subscription } from 'rxjs/Subscription';

import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { UtilsService } from '../../../utils/utils.service';

import { Classes } from '../../../services';
import { Sections } from '../../../services';
import { StudentsList } from './students-list';
import { StudentsAttendanceList } from './students-list';
import { StudentsAbsenteesListMongoData } from './students-absentees-mongo';
import { StudentsOnLeave } from './students-list';

import { ChartsModule, Color } from 'ng2-charts';
@Component({
  selector: 'app-attendance-leaves',
  templateUrl: './attendance-leaves.component.html',
  styleUrls: ['./attendance-leaves.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService]
})
export class AttendanceLeavesComponent implements OnInit {
  public select: number = 1;
  // public studentsAbsenteesListNamesMongo: any[] = new Array<StudentsAbsenteesListMongo>();
  public classes: any[] = new Array<Classes>();
  public sections: any[] = new Array<Sections>();
  public sectionNames: any[] = new Array<Sections>();
  public studentsAbsenteesListMongoDataArr: any[] = new Array<StudentsAbsenteesListMongoData>();
  public studentsOnLeaveData: any[] = new Array<StudentsOnLeave>();

  public selectedClass: string;
  public selectedClassId: number;
  public selectedsection: string;
  public selectedSectionId: number;

  studentPieChartData: any[] = new Array(3);
  studentPieChartLabelsData: any[] = new Array(3);
  enableStudetsPieChart: boolean = false;

  constructor(private formBuilder: FormBuilder, private utilService: UtilsService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) { }

  ngOnInit() {
    this.onLoadData();
  }

  onClickSelectTab(tabNumber) {
    this.select = tabNumber;
  }

  //Charts
  // Pie
  studentPieChart() {
    this.pieChartType = 'pie';
    this.pieChartLabels = this.studentPieChartLabelsData;
    this.datasets = [
      {
        data: this.studentPieChartData,
        backgroundColor: [
          "#5594c8",
          "#d0021b",
          "#fd7038"
        ],
        hoverBackgroundColor: [
          "#5594c8",
          "#d0021b",
          "#fd7038"
        ]
      }];
  }
  public pieChartLabels: string[] = this.studentPieChartLabelsData;
  public pieChartType: string;
  public datasets: any[];
  public colors: Array<Color> = [{}];
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  //

  //LINE CHART
  public lineChartData: Array<any> = [
    { data: [35, 30, 50, 55, 60, 48, 50, 70, 60, 70, 70, 60], label: 'Series A' },
    // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'},
    // {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: '#ffffff',
      borderColor: '  solid 1px #4567ae',
      pointBackgroundColor: ' #4a90e2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },

  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';



  //ENDS


  onLoadData() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'class_id,class_name');
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
        this.log.consoleLog(this.classes.length);
      });
      this.loadSections();
    });



  }

  loadSections() {
    var queryFilters = new URLSearchParams;
    queryFilters.set('fields', 'section_id,section_name');
    this.dbService.query('mst_sections', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((sections) => {
        this.sections.push(Sections.fromJson(sections));
      });
      // this.onselectSection(this.selectedSectionId);
      if (this.classes.length > 0) {
        this.onLoadLeaveStudents(this.classes[0].class_id, this.sections[0].section_id);
        this.onLoadStudentsWRTClassSection(this.classes[0].class_id, this.sections[0].section_id);
        this.selectedClass = this.classes[0].class_name;
        this.selectedsection = this.sections[0].section_name;
      }
    });
  }


  /**
   *
   * @param _class Selectde classID
   * On select class Id filter class_name with respect to class Id
   */
  selectedClassData: any[] = [];
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
      // this.onLoadStudentsRecentlyRegistered();
    }

  }

  /**
   *
   * @param _section Selected SectionId
   * On selct sectionId Load its SectionName wrt sectionId
   * And The students Details of Selected Class and selected section
   */
  onselectSection(_section) {
    this.selectedSectionId = _section;
    if (_section > 0 && this.selectedClassId > 0) {
      this.sections.filter((data) => {
        if (data.section_id == _section) {
          this.selectedsection = data.section_name;
        }
        this.log.consoleLog(this.selectedsection);

        this.enableStudetsPieChart = false;

      });
      this.onLoadLeaveStudents(this.selectedClassId, this.selectedSectionId);
      this.onLoadStudentsWRTClassSection(this.selectedClassId, this.selectedSectionId);
    }
    else {
      this.selectedsection = "";
    }
  }


  /**
   * 
   * @param Class_id selected class id
   * Select sections WRT Selected class
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



  public studentsGeneralDetails: any[] = new Array<StudentsList>();
  /**
   * 
   * @param Class_id Selected classs
   * @param section_id Selected Section
   * This loads the students wrt class and section
   */
  onLoadStudentsWRTClassSection(Class_id, section_id) {

    if (Class_id > 0 && section_id > 0) {
      let param = [{
        "name": "Class_id",
        "value": Class_id
      },
      {
        "name": 'section_id',
        "value": section_id
      }
      ];

      this.dbService.getDataFromProc('mstStudentEmailInfoSection', param).subscribe((result) => {

        {
          this.studentsGeneralDetails = []
          result.resource.forEach((item) => {
            this.studentsGeneralDetails.push(StudentsList.fromJson(item));
          });
        }
        // this.studentPieChartData = [];
        // this.studentPieChartLabelsData = [];
        this.log.consoleLog(this.studentsGeneralDetails);
        this.studentsAbsenteesMongoDataFcn();
      });

    }
    else {
      this.studentsGeneralDetails = [];
    }
  }


  /**
   * 
   * @param class_id selected classs Id 
   * @param sec_id selected section id
   * Load the data of students who are on leave on current day 
   * based on selected class and selected section
   */
  onLoadLeaveStudents(class_id, sec_id) {
    // this.log.consoleLog(SEL_DATE);
    let param = [{
      "name": "SEL_DATE",
      "value": ''
    },
    {
      "name": 'CLASS_ID',
      "value": class_id
    },
    {
      "name": 'SEC_ID',
      "value": sec_id
    }
    ];
    this.dbService.getDataFromProc('STUDENTS_ON_LEAVE', param).subscribe((result) => {
      {
        this.log.consoleLog(result);
        this.studentsOnLeaveData = []
        result.resource.forEach((item) => {
          this.studentsOnLeaveData.push(StudentsOnLeave.fromJson(item));
        });
      }
      this.log.consoleLog(this.studentsOnLeaveData);
    });
  }


  // studentsAbsenteesListMongo() {
  //   var leaves: any = 2
  //   var queryHeaders = new URLSearchParams;
  //   queryHeaders.set('filter', '(date =' + "2017-5-16" + ') AND (type =' + "student" + ') AND (class_id =' + this.selectedClassId + ') AND (section_id =' + this.selectedSectionId + ')')
  //   this.dbService.queryMongo(this.utilService.attendanceTable, '', queryHeaders).subscribe((data) => {
  //     this.studentsAbsenteesListNamesMongo = [];
  //     var data: any = data.json();
  //     data.resource.forEach((view) => {
  //       this.studentsAbsenteesListNamesMongo.push(StudentsAbsenteesListMongo.fromJson(view));
  //     });
  //     // this.log.consoleLog(this.studentsAbsenteesListNamesMongo);
  //     this.studentsAttendanceSegrigatedList();

  //     // this.studentPieChartData.push(((this.studentsGeneralDetails.length) - (this.studentsAbsenteesListNamesMongo[0].studentAttendance.length)), this.studentsAbsenteesListNamesMongo[0].studentAttendance.length,leaves);
  //     this.studentPieChartData[0] = ((this.studentsGeneralDetails.length) - (this.studentsAbsenteesListNamesMongo[0].studentAttendance.length));
  //     this.studentPieChartData[1] = this.studentsAbsenteesListNamesMongo[0].studentAttendance.length;
  //     this.studentPieChartData[2] = leaves;
  //     // this.studentPieChartLabelsData.push(((this.studentsGeneralDetails.length) - (this.studentsAbsenteesListNamesMongo[0].studentAttendance.length)) + " - Present", (this.studentsAbsenteesListNamesMongo[0].studentAttendance.length) + " - Absent", 2 + " - Leave")
  //     this.studentPieChartLabelsData[0] = ((this.studentsGeneralDetails.length) - (this.studentsAbsenteesListNamesMongo[0].studentAttendance.length)) + " - Present";
  //     this.studentPieChartLabelsData[1] = (this.studentsAbsenteesListNamesMongo[0].studentAttendance.length) + " - Absent"
  //     this.studentPieChartLabelsData[2] = 2 + " - Leave"
  //     this.log.consoleLog(this.studentPieChartData);
  //     this.log.consoleLog(this.studentPieChartLabelsData);
  //     this.studentPieChart();
  //     this.enableStudetsPieChart = true;

  //   });
  // }


  /**
   * Data from data base MongoDB
   */
  studentsAbsenteesMongoDataFcn() {

    var queryHeaders = new URLSearchParams;
    // Fetch the data From Mongo DB attendance table based on type and conditions
    queryHeaders.set('filter', '(date =' + this.utilService.date + ') AND (type =' + this.utilService.Student + ') AND (class_id =' + this.selectedClassId + ') AND (section_id =' + this.selectedSectionId + ')')
    this.dbService.queryMongo(this.utilService.attendanceTable, '', queryHeaders).subscribe((data) => {
      this.studentsAbsenteesListMongoDataArr = [];
      var data: any = data.json();
      data.resource.forEach((view) => {
        this.studentsAbsenteesListMongoDataArr.push(StudentsAbsenteesListMongoData.fromJson(view));
      });
      this.studentsAttendanceSegrigatedList();
      this.log.consoleLog(this.studentsAbsenteesListMongoDataArr);
      /// Alocate the data to Pie chart : Prasent absent and leaves data
      this.studentPieChartData[0] = ((this.studentsGeneralDetails.length) - (this.studentsAbsenteesListMongoDataArr.length));
      this.studentPieChartData[1] = this.studentsAbsenteesListMongoDataArr.length;
      this.studentPieChartData[2] = this.studentsOnLeaveData.length;
      // Allocate the data To Pie chart data of labels
      this.studentPieChartLabelsData[0] = ((this.studentsGeneralDetails.length) - (this.studentsAbsenteesListMongoDataArr.length) - (this.studentsOnLeaveData.length)) + " - Present"
      this.studentPieChartLabelsData[1] = (this.studentsAbsenteesListMongoDataArr.length) + " - Absent"
      this.studentPieChartLabelsData[2] = this.studentsOnLeaveData.length + " - Leave";
      this.log.consoleLog(this.studentPieChartData);
      this.log.consoleLog(this.studentPieChartLabelsData);
      this.studentPieChart();
      this.enableStudetsPieChart = true;
    });
  }


  /**
   * Segrigate the data and add the absents and leaves to array
   */
  studentsAttendanceSegrigatedListDetails: any[] = new Array<StudentsAttendanceList>();
  studentsAttendanceSegrigatedList() {
    this.studentsAttendanceSegrigatedListDetails = [];
    this.studentsGeneralDetails.filter((gendetails) => {
      this.studentsAttendanceSegrigatedListDetails.push(new StudentsAttendanceList(gendetails.txtFirstName, gendetails.txtLastName, gendetails.intRegistrationId, this.utilService.attendancePrStatus, 5, 5, 10));
      this.studentsAbsenteesListMongoDataArr.filter((data) => {
        if (data.intRegistrationId == gendetails.intRegistrationId) {
          this.studentsAttendanceSegrigatedListDetails.push(new StudentsAttendanceList(gendetails.txtFirstName, gendetails.txtLastName, data.intRegistrationId, this.utilService.attendanceAbStatus, 5, 5, 10));
        }
      });
      this.studentsOnLeaveData.filter((leavedata) => {
        if (leavedata.intRegistrationId == gendetails.intRegistrationId) {
          this.studentsAttendanceSegrigatedListDetails.push(new StudentsAttendanceList(gendetails.txtFirstName, gendetails.txtLastName, leavedata.intRegistrationId, this.utilService.attendanceLeaveStatus, 5, 5, 10));
        }
      });
    });
    this.studentsAttendanceSegrigatedListDetails = this.utilService.removeDulpicates(this.studentsAttendanceSegrigatedListDetails, 'intRegistrationId');
    this.log.consoleLog(this.studentsAttendanceSegrigatedListDetails);
  }

}
