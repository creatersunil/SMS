import { Component, OnInit } from '@angular/core';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';

import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { ChartsModule, Color } from 'ng2-charts';
import { UtilsService } from '../../../utils/utils.service';
import { TeachersList, TeachersAttendanceList } from './teachers-list';
// import { TeachersAbsenteesListMongo } from './teachers-absentees-mongo';
import { TeachersAbsenteesListMongoData } from './teachers-absentees-mongo';
import { TeachersOnLeave } from './teachers-list';
@Component({
  selector: 'app-attendance-leave',
  templateUrl: './attendance-leave.component.html',
  styleUrls: ['./attendance-leave.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService]
})
export class AttendanceLeaveComponent implements OnInit {
  public select: number = this.utilService.select;
  public enableTeacherPieChart: boolean = false;
  public date: any;
  public teachersPieChartData: any[] = new Array(3);
  public teachersPieChartLabelsData: any[] = new Array(3);
  public teachersAttendanceList: any[] = new Array<TeachersAttendanceList>();
  // public teacherAbsenteesList: any[] = new Array<TeachersAbsenteesListMongo>();
  public teacherAbsenteesListData: any[] = new Array<TeachersAbsenteesListMongoData>();
  public teachersOnLeaveData: any[] = new Array<TeachersOnLeave>();

  constructor(private dbService: DbService, private log: Logs, private userConfig: UserConfig, private utilService: UtilsService) {

  }
  onClickSelectTab(tabnumber) {
    this.select = tabnumber;
    this.log.consoleLog(this.utilService.date);
  }
  ngOnInit() {
    this.loadStaffDetails();
    this.onLoadLeaveTeachers();
  }

  //Charts
  // Pie
  public pieChartLabels: string[] = this.teachersPieChartLabelsData;
  // public pieChartData: number[] = this.teachersPieChartData;
  public pieChartType: string = 'pie';
  public datasets: any[] = [
    {
      data: this.teachersPieChartData,
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
    // { // dark grey
    //   backgroundColor: 'rgba(77,83,96,0.2)',
    //   borderColor: 'rgba(77,83,96,1)',
    //   pointBackgroundColor: 'rgba(77,83,96,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(77,83,96,1)'
    // },
    // { // grey
    //   backgroundColor: 'rgba(148,159,177,0.2)',
    //   borderColor: 'rgba(148,159,177,1)',
    //   pointBackgroundColor: 'rgba(148,159,177,1)',
    //   pointBorderColor: '#fff',
    //   pointHoverBackgroundColor: '#fff',
    //   pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    // }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';
  //




  teacherBasicDetails: any[] = new Array<TeachersList>();
  loadStaffDetails() {


    this.dbService.getDataFromProc('mstStaffRecords', '').subscribe((result) => {
      {
        this.log.consoleLog(result.resource.length)
        if (result.resource.length > 0) {
          result.resource.forEach((item) => {
            this.teacherBasicDetails.push(TeachersList.fromJson(item));
          });
        }

      }
      this.log.consoleLog(this.teacherBasicDetails);

      /**
       * On get current day date call mongodb to
       *  get attendance details of staff for that day
       */
      this.dbService.getDateTime('getDate').subscribe((date) => {
        this.date = date;
        this.log.consoleLog(this.date);
        this.teachersAbsenteesMongoDataFcn();
      });

    });
  }

  /**
   * Load the teachers who are on leave
   */
  onLoadLeaveTeachers() {
    // this.log.consoleLog(SEL_DATE);
    let param = [{
      "name": "SEL_DATE",
      "value": ''
    }];

    this.dbService.getDataFromProc('TEACHERS_ON_LEAVE', param).subscribe((result) => {
      {
        this.log.consoleLog(result.resource.length);
        this.teachersOnLeaveData = []
        result.resource.forEach((item) => {
          this.teachersOnLeaveData.push(TeachersOnLeave.fromJson(item));
        });
      }
      this.log.consoleLog(this.teachersOnLeaveData);
    });
  }


  /**
   * Load the details of teachers who are absent on current day
   */
  teachersAbsenteesMongoDataFcn() {
    // var leaves: any = 2;
    this.log.consoleLog(this.date);
    var queryHeaders = new URLSearchParams;
    queryHeaders.set('filter', '(date =' + this.date + ') AND (type =' + this.utilService.Staff + ')')
    this.dbService.queryMongo(this.utilService.attendanceTable, '', queryHeaders).subscribe((data) => {
      this.teacherAbsenteesListData = [];
      // this.log.consoleLog(data.resource.length)
      var data: any = data.json();
      data.resource.forEach((view) => {
        this.teacherAbsenteesListData.push(TeachersAbsenteesListMongoData.fromJson(view));
      });
      /// Segrigate the attendance data
      this.teacherAttendanceDetails();
      //////////
      this.log.consoleLog(this.teacherAbsenteesListData);
      /// Assign data to pie chart
      this.teachersPieChartData[0] = ((this.teacherBasicDetails.length) - (this.teacherAbsenteesListData.length) - (this.teachersOnLeaveData.length));
      this.teachersPieChartData[1] = this.teacherAbsenteesListData.length;
      this.teachersPieChartData[2] = this.teachersOnLeaveData.length;

      /// Assign data to pie chart labels
      this.teachersPieChartLabelsData[0] = ((this.teacherBasicDetails.length) - (this.teacherAbsenteesListData.length) - (this.teachersOnLeaveData.length)) + " - Present"
      this.teachersPieChartLabelsData[1] = (this.teacherAbsenteesListData.length) + " - Absent"
      this.teachersPieChartLabelsData[2] = this.teachersOnLeaveData.length + " - Leave";
      this.log.consoleLog(this.teachersPieChartData);
      this.log.consoleLog(this.teachersPieChartLabelsData);
      this.enableTeacherPieChart = true;
    });
  }


  teacherAttendanceDetails() {
    this.teacherBasicDetails.filter((data) => {
      this.teachersAttendanceList.push(new TeachersAttendanceList(data.txtFirstName, data.txtLastName, data.intRegistrationId,
        this.utilService.attendancePrStatus, 2, 5, 7, data.class_name, data.section_name))
      ///  Push the data of attendance 
      this.teacherAbsenteesListData.filter((absenteesData) => {
        if (absenteesData.intRegistrationId == data.intRegistrationId) {
          // this.teachersAttendanceList.splice(data,1);
          this.teachersAttendanceList.push(new TeachersAttendanceList(data.txtFirstName, data.txtLastName, data.intRegistrationId,
            this.utilService.attendanceAbStatus, 2, 5, 7, data.class_name, data.section_name))
        }
      });
      // push of data leave 
      this.teachersOnLeaveData.filter((leavedata) => {
        if (leavedata.intRegistrationId == data.intRegistrationId) {
          // this.teachersAttendanceList.splice(data,1);
          this.teachersAttendanceList.push(new TeachersAttendanceList(data.txtFirstName, data.txtLastName, data.intRegistrationId,
            this.utilService.attendanceLeaveStatus, 2, 5, 7, data.class_name, data.section_name))
        }
      });
    })
    this.teachersAttendanceList = this.utilService.removeDulpicates(this.teachersAttendanceList, 'intRegistrationId');

    this.log.consoleLog(this.teachersAttendanceList);
  }


}
