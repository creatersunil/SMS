import { Component, OnInit } from '@angular/core';
import { WorkingDaysInfo } from './wokingDaysDataMongo-Json';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
//import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SnotifyService, SnotifyConfig } from 'ng-snotify';
import { CalendarService } from './calendar.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subscription } from 'rxjs/Subscription';
import { DbService, UserConfig, MessageService, SUCCESS, FAILED, Logs } from '../../../../services';
import { AttendanceLeavesInfo } from './attendaneLeavesInfo-Json';
import { AttendanceLeavesTypeList } from './attendanceLeavesTypeList-Json';
import { AttendanceUsedLeaves } from './attendanceUsedLeaveInfo-Json';
import { AttendanceInfo } from './attendanceMongo-Json';
import { AttendanceLeaveInfo } from './attendanceLeavesData-Json';

@Component({
  selector: 'app-my-attendance',
  templateUrl: './my-attendance.component.html',
  styleUrls: ['./my-attendance.component.scss'],
  providers: [DbService, UserConfig, Logs,CalendarService],
})
export class MyAttendanceComponent implements OnInit {

   public select: number = 1;
  loginId: any;
  public currentDate: number;


  public attendanceLeavesDetails: any[] = new Array<AttendanceLeavesInfo>();
  public attendanceLeaveListData: any[] = new Array<AttendanceLeavesTypeList>();
  public attendanceUsedLeaveListData: any[] = new Array<AttendanceUsedLeaves>();


  /**
   * Below Variable are using My-Actions/Attendance module
   */
  public calendarConfiguration: any;
  private _calendar: Object;
  public calendarAbsentLeaveData: any[] = new Array<AttendanceLeaveInfo>();
  public schoolWorkingDays: any[] = new Array<WorkingDaysInfo>();
  public totalPresentsDays: number = 0;

  public attendanceListData: any[] = new Array<AttendanceInfo>();
  public totalAbsents: number = 0;
  public attendanceModuleLeaves: number = 0;
  disablecal = false;
  public totalAttendanceRecordLength: number = 0;
  public calendarAbsentColor: string = '#de0c41';
  public calendarAbsentText: string = 'Absent';
  public calendarLeaveColor:string='#f6a623';
  public calendarLeaveText:string='Leave';


  constructor(private _calendarService: CalendarService, private dbService: DbService, 
    private log: Logs,private userConfig: UserConfig, private notify: SnotifyService) {

     }

  ngOnInit() {

    /**
     * notification of snotify services
     */
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });

    /**
     * loadLeavesDetailedData() for using the display the leave details in My-Actions/Leaves module
     * it load ngOnit() is constructor method 
     */
    this.loadLeavesDetailedData();
    /**
     * loadMstLeaveData() for using load the mst_leave table and tr_user_used_leaves table
     * from database
     */
    this.loadMstLeaveData();

  }



  loadMstLeaveData() {
    //mstLeave table data Load
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'intLeaveId,txtLeaveType,intNumberOfLeave');
    this.dbService.query('mstleave', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if(data.resource.length>0){
      data.resource.forEach((leaveListData) => {
        this.attendanceLeaveListData.push(AttendanceLeavesTypeList.fromJson(leaveListData));
        this.log.consoleLog(this.attendanceLeaveListData.length);
      });
      this.log.consoleLog(data);
    }else{
    this.notify.error("Error", "No Data in DataBase");
    }
    });


    //Load data from tr_user_used_leaves this table stores the used leaves information
    queryFilters.set('fields', 'id,registrationId,leaveId,totalLeaves');
    queryFilters.set('filter', 'registrationId =' + this.loginId);
    this.dbService.query('tr_user_used_leaves', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if(data.resource.length>0){
      data.resource.forEach((usedLeaveListData) => {
        this.attendanceUsedLeaveListData.push(AttendanceUsedLeaves.fromJson(usedLeaveListData));
        console.log(this.attendanceUsedLeaveListData.length);
      });
      this.log.consoleLog('consoleLog used leaves');
      this.log.consoleLog(this.attendanceUsedLeaveListData);

      this.CalculateTotalNumberOfLeavesTaken();
      }
    else{
       this.notify.error("Error", "No Data in DataBase");
    }

    });


  }



  loadLeavesDetailedData() {
    this.loginId = this.userConfig.getRegId();

    let param = {
      "name": "loginId",
      "value": this.loginId
    };
    this.dbService.getDataFromProc('LeaveStatus', param).subscribe((result) => {
      {
        if(result.resource.length>0){
        this.attendanceLeavesDetails = [];
        result.resource.forEach((item) => {
          this.attendanceLeavesDetails.push(AttendanceLeavesInfo.fromJson(item));
        });
         this.log.consoleLog(this.attendanceLeavesDetails);

      /**
       * To cal the below function to Leave view on calendar
       */
      this.pushLeavesDataTo_Calendar();
      } 
    else{
      this.notify.error("Error", "No Data in DataBase");
    }
      }
   
    });
  }


  /**
   * loadWorkingDayDataFromMongoDb() using the total Number of Present days functionality
   */
  loadWorkingDayDataFromMongoDb() {

    var queryHeaders = new URLSearchParams;
    queryHeaders.set('fields', 'intRegistrationId,date,class_id,section_id,type,txtName');
    this.dbService.queryMongo('attendence', '', queryHeaders).subscribe((result) => {
      var data: any = result.json();
      if(data.resource.length>0){
      data.resource.forEach((schoolWorkingDays) => {
        this.schoolWorkingDays.push(WorkingDaysInfo.fromJson(schoolWorkingDays));
      });

      this.findTotalPresentDays_OutofSchoolWorkingDays();
      }
     else{
      this.notify.error("Error", "No Data in DataBase");
    }
    });


  }


  loadAttendanceDataFromMongoDB() {
    var queryHeaders = new URLSearchParams;
    queryHeaders.set('fields', 'intRegistrationId,date');
    queryHeaders.set('filter', 'intRegistrationId =' + this.loginId);
    this.dbService.queryMongo('attendence', '', queryHeaders).subscribe((result) => {
      var data: any = result.json();
      if(data.resource.length>0){
      data.resource.forEach((attendanceListData) => {
        this.attendanceListData.push(AttendanceInfo.fromJson(attendanceListData));
        this.log.consoleLog('Attendance Info');
        this.log.consoleLog(this.attendanceListData.length);
      });
      this.log.consoleLog(this.attendanceListData);

      /**
       * To cal below function to Absents view on calendar
       */
      this.pushAttendanceDataTo_calendar();
      }
    else{
        this.notify.error("Error", "No Data in DataBase");
    }

    });

  }

  loadRefreshData() {
    //mstLeave table data Load
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'intLeaveId,txtLeaveType,intNumberOfLeave');
    this.dbService.query('mstleave', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if(data.resource.length>0){
      data.resource.forEach((leaveListData) => {
        this.attendanceLeaveListData.push(AttendanceLeavesTypeList.fromJson(leaveListData));
      });
      }
    else{
      this.notify.error("Error", "No Data in DataBase");
    }
    });


    //Load data from tr_user_used_leaves this table stores the used leaves information
    queryFilters.set('fields', 'id,registrationId,leaveId,totalLeaves');
    queryFilters.set('filter', 'registrationId =' + this.loginId);
    this.dbService.query('tr_user_used_leaves', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if(data.resource.length>0){
      data.resource.forEach((usedLeaveListData) => {
        this.attendanceUsedLeaveListData.push(AttendanceUsedLeaves.fromJson(usedLeaveListData));
      });
      }
    else{
      this.notify.error("Error", "No Data in DataBase");
    }
    });

  }


  public onCalendarReady(calendar): void {
    this._calendar = calendar;
  }



  /** ************************************************************************************** 
             *************** My-Actions Module/Attendance code Started Here***************
        *************************************************************************************** 
     */

  CalculateTotalNumberOfLeavesTaken() {

    /**
     * This code using to My actions/Attendance module for calculating the
     * total number leaves taken start code here
     */
    this.attendanceUsedLeaveListData.filter((usedleaveData) => {
      if (usedleaveData.registrationId == this.loginId) {
        this.attendanceModuleLeaves = this.attendanceModuleLeaves + usedleaveData.totalLeaves;

      }
    });
    this.log.consoleLog('attendanceModuleLeaves');
    this.log.consoleLog(this.attendanceModuleLeaves);

    this.loadAttendanceDataFromMongoDB();
    this.loadWorkingDayDataFromMongoDb();
    /**
     * Attendance leaves code End here
     */

  }

  pushLeavesDataTo_Calendar() {

    //push leave data to calendarAbsentLeaveData array
    this.attendanceLeavesDetails.filter((data) => {
      this.calendarAbsentLeaveData.push(new AttendanceLeaveInfo(data.user_id, data.dtFromDate, data.dtToDate,
        this.calendarLeaveColor, this.calendarLeaveText));
    });
  }


  pushAttendanceDataTo_calendar() {

    /**
      * total number of Absent will store here
      */
    this.totalAbsents = this.attendanceListData.length;

    /**
     * push attendance data to calendarAbsentLeaveData array
     *  My-Actions/Attendance module calendar viewing data code here
     * 
     */
    this.attendanceListData.filter((attendanceData) => {
      this.calendarAbsentLeaveData.push(new AttendanceLeaveInfo(attendanceData.intRegistrationId, attendanceData.date,
        attendanceData.date, this.calendarAbsentColor, this.calendarAbsentText));
    });
    this.log.consoleLog(this.calendarAbsentLeaveData);

    this.calendarConfiguration = this._calendarService.getData(this.calendarAbsentLeaveData);
    this.disablecal = true;
    //this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);

  }

  findTotalPresentDays_OutofSchoolWorkingDays() {

    this.log.consoleLog('schoolWorkingDays');
    this.log.consoleLog(this.schoolWorkingDays.length);
    this.totalAttendanceRecordLength = this.schoolWorkingDays.length;
    this.totalPresentsDays = this.totalAttendanceRecordLength - (this.totalAbsents + this.attendanceModuleLeaves);
    this.log.consoleLog("totalPresentDays");
    this.log.consoleLog(this.totalPresentsDays);
  }

}
