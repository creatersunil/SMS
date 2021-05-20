import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SnotifyService, SnotifyConfig } from 'ng-snotify';
import { Logs } from './../../services/logging/logs';
@Component({
  selector: 'app-my-actions',
  templateUrl: './my-actions.component.html',
  styleUrls: ['./my-actions.component.scss'],
  providers: [Logs],
})
export class MyActionsComponent implements OnInit {

  public select: number = 1;

  constructor(private log: Logs,private notify: SnotifyService,private router: Router) {


  }

  ngOnInit() {

    this.onClickSelectTab(this.select);
    /**
     * notification of snotify services
     */
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });

    // /**
    //  * loadLeavesDetailedData() for using the display the leave details in My-Actions/Leaves module
    //  * it load ngOnit() is constructor method 
    //  */
    // this.loadLeavesDetailedData();
    // /**
    //  * loadMstLeaveData() for using load the mst_leave table and tr_user_used_leaves table
    //  * from database
    //  */
    // this.loadMstLeaveData();

    // /**
    //  * loadMstHolidaysData() for using load the mst_holiday table from database
    //  */
    // this.loadMstHolidaysData();
  }


  onClickSelectTab(tabNumber) {
    this.select = tabNumber;
    if (tabNumber === 1) {
      this.router.navigate(['/pages/my-actions/my-attendance']);
    }
    else if(tabNumber === 2) {
      this.router.navigate(['/pages/my-actions/my-leaves',]);
    }
    else{
      this.router.navigate(['/pages/my-actions/my-documents',]);
    }
  }



  // loadMstHolidaysData() {
  //   var queryFilters = new URLSearchParams();
  //   queryFilters.set('fields', 'holiday_id,holiday_name,type_id,start_Date,end_Date');
  //   queryFilters.set('filter', 'type_id =' + this.typeId);
  //   this.dbService.query('mst_holiday', '', queryFilters).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((holidayListData) => {
  //       this.holidayListData.push(HolidayInfo.fromJson(holidayListData));
  //       this.log.consoleLog(this.holidayListData.length);
  //     });
  //     this.log.consoleLog(data);
  //   });
  // }


  // loadMstLeaveData() {
  //   //mstLeave table data Load
  //   var queryFilters = new URLSearchParams();
  //   queryFilters.set('fields', 'intLeaveId,txtLeaveType,intNumberOfLeave');
  //   this.dbService.query('mstleave', '', queryFilters).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((leaveListData) => {
  //       this.leaveListData.push(LeavesTypeList.fromJson(leaveListData));
  //       this.log.consoleLog(this.leaveListData.length);
  //     });
  //     this.log.consoleLog(data);
  //   });


  //   //Load data from tr_user_used_leaves this table stores the used leaves information
  //   queryFilters.set('fields', 'id,registrationId,leaveId,totalLeaves');
  //   queryFilters.set('filter', 'registrationId =' + this.loginId);
  //   this.dbService.query('tr_user_used_leaves', '', queryFilters).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((usedLeaveListData) => {
  //       this.usedLeaveListData.push(UsedLeaves.fromJson(usedLeaveListData));
  //       console.log(this.usedLeaveListData.length);
  //     });
  //     this.log.consoleLog('consoleLog used leaves');
  //     this.log.consoleLog(this.usedLeaveListData);

  //     this.CalculateTotalNumberOfLeavesTaken();

  //   });


  // }



  // loadLeavesDetailedData() {
  //   this.loginId = this.userConfig.getRegId();

  //   let param = {
  //     "name": "loginId",
  //     "value": this.loginId
  //   };
  //   this.dbService.getDataFromProc('LeaveStatus', param).subscribe((result) => {
  //     {
  //       this.leavesDetails = [];
  //       result.resource.forEach((item) => {
  //         this.leavesDetails.push(LeavesInfo.fromJson(item));
  //       });
  //     }
  //     this.log.consoleLog(this.leavesDetails);

  //     /**
  //      * To cal the below function to Leave view on calendar
  //      */
  //     this.pushLeavesDataTo_Calendar();
  //   });
  // }


  // /**
  //  * loadWorkingDayDataFromMongoDb() using the total Number of Present days functionality
  //  */
  // loadWorkingDayDataFromMongoDb() {

  //   var queryHeaders = new URLSearchParams;
  //   queryHeaders.set('fields', 'intRegistrationId,date,class_id,section_id,type,txtName');
  //   this.dbService.queryMongo('attendence', '', queryHeaders).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((schoolWorkingDays) => {
  //       this.schoolWorkingDays.push(WorkingDaysInfo.fromJson(schoolWorkingDays));
  //     });

  //     this.findTotalPresentDays_OutofSchoolWorkingDays();
  //   });


  // }


  // loadAttendanceDataFromMongoDB() {
  //   var queryHeaders = new URLSearchParams;
  //   queryHeaders.set('fields', 'intRegistrationId,date');
  //   queryHeaders.set('filter', 'intRegistrationId =' + this.loginId);
  //   this.dbService.queryMongo('attendence', '', queryHeaders).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((attendanceListData) => {
  //       this.attendanceListData.push(AttendanceInfo.fromJson(attendanceListData));
  //       this.log.consoleLog('Attendance Info');
  //       this.log.consoleLog(this.attendanceListData.length);
  //     });
  //     this.log.consoleLog(this.attendanceListData);

  //     /**
  //      * To cal below function to Absents view on calendar
  //      */
  //     this.pushAttendanceDataTo_calendar();

  //   });

  // }

  // loadRefreshData() {
  //   //mstLeave table data Load
  //   var queryFilters = new URLSearchParams();
  //   queryFilters.set('fields', 'intLeaveId,txtLeaveType,intNumberOfLeave');
  //   this.dbService.query('mstleave', '', queryFilters).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((leaveListData) => {
  //       this.leaveListData.push(LeavesTypeList.fromJson(leaveListData));
  //     });
  //   });


  //   //Load data from tr_user_used_leaves this table stores the used leaves information
  //   queryFilters.set('fields', 'id,registrationId,leaveId,totalLeaves');
  //   queryFilters.set('filter', 'registrationId =' + this.loginId);
  //   this.dbService.query('tr_user_used_leaves', '', queryFilters).subscribe((result) => {
  //     var data: any = result.json();
  //     data.resource.forEach((usedLeaveListData) => {
  //       this.usedLeaveListData.push(UsedLeaves.fromJson(usedLeaveListData));
  //     });
  //   });

  // }


  // public onCalendarReady(calendar): void {
  //   this._calendar = calendar;
  // }



  // /** ************************************************************************************** 
  //            *************** My-Actions Module/Attendance code Started Here***************
  //       *************************************************************************************** 
  //    */

  // CalculateTotalNumberOfLeavesTaken() {

  //   /**
  //    * This code using to My actions/Attendance module for calculating the
  //    * total number leaves taken start code here
  //    */
  //   this.usedLeaveListData.filter((usedleaveData) => {
  //     if (usedleaveData.registrationId == this.loginId) {
  //       this.attendanceModuleLeaves = this.attendanceModuleLeaves + usedleaveData.totalLeaves;

  //     }
  //   });
  //   this.log.consoleLog('attendanceModuleLeaves');
  //   this.log.consoleLog(this.attendanceModuleLeaves);

  //   this.loadAttendanceDataFromMongoDB();
  //   this.loadWorkingDayDataFromMongoDb();
  //   /**
  //    * Attendance leaves code End here
  //    */

  // }

  // pushLeavesDataTo_Calendar() {

  //   //push leave data to calendarAbsentLeaveData array
  //   this.leavesDetails.filter((data) => {
  //     this.calendarAbsentLeaveData.push(new AttendanceLeaveInfo(data.user_id, data.dtFromDate, data.dtToDate,
  //       this.calendarLeaveColor, this.calendarLeaveText));
  //   });
  // }


  // pushAttendanceDataTo_calendar() {

  //   /**
  //     * total number of Absent will store here
  //     */
  //   this.totalAbsent = this.attendanceListData.length;

  //   /**
  //    * push attendance data to calendarAbsentLeaveData array
  //    *  My-Actions/Attendance module calendar viewing data code here
  //    * 
  //    */
  //   this.attendanceListData.filter((attendanceData) => {
  //     this.calendarAbsentLeaveData.push(new AttendanceLeaveInfo(attendanceData.intRegistrationId, attendanceData.date,
  //       attendanceData.date, this.calendarAbsentColor, this.calendarAbsentText));
  //   });
  //   this.log.consoleLog(this.calendarAbsentLeaveData);

  //   this.calendarConfiguration = this._calendarService.getData(this.calendarAbsentLeaveData);
  //   this.disablecal = true;
  //   //this.calendarConfiguration.select = (start, end) => this._onSelect(start, end);

  // }

  // findTotalPresentDays_OutofSchoolWorkingDays() {

  //   this.log.consoleLog('schoolWorkingDays');
  //   this.log.consoleLog(this.schoolWorkingDays.length);
  //   this.totalAttendanceRecordLength = this.schoolWorkingDays.length;
  //   this.totalPresentDays = this.totalAttendanceRecordLength - (this.totalAbsent + this.attendanceModuleLeaves);
  //   this.log.consoleLog("totalPresentDays");
  //   this.log.consoleLog(this.totalPresentDays);
  // }





  // /** ************************************************************************************** 
  //          *************** My-Actions Module/Attendance code Ended Here***************
  //     *************************************************************************************** 
  //  */
  // /**  ************************************************************************************** 
  //         **************** My-Actions Module/leaves code Started Here*****************
  //      **************************************************************************************
  //    */


  // formdate(fromvalue: string) {
  //   this.frmdate = fromvalue;
  //   this.today = new Date();

  //   /**
  //    * Below Variables are using minimum Startdate selection validation
  //    */
  //   this.changedFormat_FromDate = new Date(this.frmdate);
  //   this.minDateFromCurrentDate = this.today.setDate(this.today.getDate() - this.totalMinDate);

  //   /**This condition is satisfied without selecting Leave type not allowed to select Startdate */
  //   if (this.intLeavetype.value < 1) {
  //     (<FormControl>this.myForm.controls['intLeaveId'])
  //       .setValue(0, { onlySelf: true });
  //     this.notify.info("Info", "Please First select Leave type.");
  //   }
  //   /**This condition is satisfied Not allowed to select below 30 days date from Today date  */
  //   else if (this.changedFormat_FromDate <= this.minDateFromCurrentDate) {
  //     (<FormControl>this.myForm.controls['dtFromDate'])
  //       .setValue(0, { onlySelf: true });
  //     this.notify.info("Info", "Not allowed to select below 30 days dates from Today date");
  //   }

  //   /**This condition is satisfied Not allowed to select above 120 days dates from Today date */
  //   this.maxDateFromTodate = this.today.setDate(this.today.getDate() + this.totalMaxDate);
  //   if (this.changedFormat_FromDate >= this.maxDateFromTodate) {
  //     (<FormControl>this.myForm.controls['dtFromDate'])
  //       .setValue(0, { onlySelf: true });
  //     this.notify.info("Info", "Not allowed to select above 120 days dates from Today date");
  //   }

  // }

  // todate(todayvalue: string) {
  //   this.tdate = todayvalue;
  //   /**calculate total number of days difference beetween startDate and toDate */
  //   var date1 = new Date(this.frmdate);
  //   var date2 = new Date(this.tdate);
  //   var timeDiff = Math.abs(date2.getTime() - date1.getTime());
  //   this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  //   /**This condition is satisfied To Date should be greater than From date*/
  //   if (date1 > date2) {

  //     (<FormControl>this.myForm.controls['dtFromDate'])
  //       .setValue(0, { onlySelf: true });
  //     (<FormControl>this.myForm.controls['dtToDate'])
  //       .setValue(0, { onlySelf: true });

  //     this.notify.info("Info", "End Date should be greater than Start date");

  //   }
  //   else {

  //     //calculate total days excluding Sunday this code here
  //     this.startDate = new Date(this.frmdate);
  //     this.endDate = new Date(this.tdate);
  //     this.totalSundays = 0;
  //     this.totalDays = 0;
  //     for (var i = this.startDate; i <= this.endDate;) {
  //       if (i.getDay() == 0) {
  //         this.totalSundays++;
  //       }
  //       i.setTime(i.getTime() + 1000 * 60 * 60 * 24);
  //     }
  //     this.log.consoleLog('******************Sunday*********************');
  //     this.log.consoleLog(this.totalSundays);

  //     this.totalDays = (this.diffDays - this.totalSundays) + 1;

  //     //Remaining days validation
  //     if (this.totalDays > this.remainingLeaves) {
  //       // window.confirm('You have only '+this._remainingLeaves+' Remaining leaves');
  //       (<FormControl>this.myForm.controls['dtFromDate'])
  //         .setValue(0, { onlySelf: true });
  //       (<FormControl>this.myForm.controls['dtToDate'])
  //         .setValue(0, { onlySelf: true });
  //       this.totalDays = 0;
  //       this.diffDays = 0;
  //       this.notify.info("Info", "You have only " + this.remainingLeaves + " Remaining Days.")
  //     }
  //     else {
  //       (<FormControl>this.myForm.controls['days_requested'])
  //         .setValue(this.totalDays, { onlySelf: true });
  //     }

  //     this.log.consoleLog('totalDays:' + this.totalDays);

  //   }

  // }


  // onSelectRemainingDays(leaveid) {
  //   this._leaveId = leaveid;

  //   //fiter already loaded mstleave table data//////////

  //   this.leaveListData.filter((mst_leaveData) => {
  //     if (mst_leaveData.intLeaveId == leaveid) {
  //       this._number_of_leave = mst_leaveData.intNumberOfLeave;
  //       this.log.consoleLog(this._number_of_leave);
  //     }
  //   });

  //   //filter already loaded tr_user_used_leaves table data///////////////

  //   this.usedLeaveListData.filter((usedleaveData) => {
  //     if (usedleaveData.leaveId == leaveid && this.loginId == usedleaveData.registrationId) {
  //       this._totalLeaves = usedleaveData.totalLeaves;
  //       this.log.consoleLog(this._totalLeaves);
  //     }
  //   });
  //   this.remainingLeaves = (this._number_of_leave) - (this._totalLeaves);
  //   this.log.consoleLog('_remainingLeaves');
  //   this.log.consoleLog(this.remainingLeaves);
  //   this.takenLeaves = this._totalLeaves;


  //   this._totalLeaves = 0;
  //   this.fcnTxtLeaveType(leaveid);
  // }


  // //Press Submit button onClickNewLeaveSubmit() will Execute
  // //leave data inserted to database
  // onClickNewLeaveSubmit() {
  //   this.log.consoleLog(this.myForm.getRawValue());
  //   this.dbService.insert('tbl_staff_leaves', this.onSubmitApplyNewLeaveInfoIsconverToDBFormat(this.currentDate, this.totalDays, this.intLeavetype.value, this.dtFromDate.value, this.dtToDate.value, this.txtReason.value, this.loginId)).subscribe((data) => {
  //     if (data.resource.length > 0) {
  //       this.onSubmitUsedLeaves();
  //       this.leavesDetails.push(new LeavesInfo(data.resource.leaveid, this.dtFromDate.value, this.dtToDate.value, this.intLeavetype.value, this.days_requested.value, 0, this.txtLeaveTypeName));
  //       this.resetAllvalus();
  //       console.log(data);
  //       //Success notification
  //       this.notify.success("Success", data.resource.length + " Leave is Applied");
  //     }
  //     else {
  //       this.notify.error("Error", "Somthing went wrong!!");
  //     }
  //   });
  // }

  // resetAllvalus() {
  //   this.myForm.reset();
  //   this._number_of_leave = 0;
  //   this._totalLeaves = 0;
  //   this.takenLeaves = 0;
  //   this.remainingLeaves = 0;
  //   this.totalDays = 0;
  //   this.diffDays = 0;
  //   this.createNewLeave = false;
  // }

  // public _usedleaveas: number = 0;
  // public isExist: boolean = false;
  // onSubmitUsedLeaves() {
  //   this.log.consoleLog('tr_user_used_leaves Data update and Insert');
  //   this.usedLeaveListData.filter((usedleaveData) => {
  //     if (usedleaveData.leaveId == this._leaveId && this.loginId == usedleaveData.registrationId) {
  //       //this.user_usedLeaves_leaveid=usedleaveData.leaveId;
  //       this._usedleaveas = (usedleaveData.totalLeaves) + (this.totalDays);
  //       this.isExist = true;
  //       this.log.consoleLog(this._usedleaveas);
  //     }
  //   });
  //   this.usedTableNewLeaveORAllReadyExitsLeaveTypeInsertOrUpadateOperation(this.isExist);
  // }


  // usedTableNewLeaveORAllReadyExitsLeaveTypeInsertOrUpadateOperation(ioru: boolean) {
  //   var queryFilters = new URLSearchParams();
  //   if (ioru == true) {
  //     queryFilters.set('filter', 'leaveid= ' + this._leaveId);
  //     this.dbService.update('tr_user_used_leaves', this.tr_user_used_leaves_TableUpdateOperationConverToDBFormat(this._usedleaveas), queryFilters).subscribe((data) => {
  //       this.log.consoleLog(data);
  //     });
  //   }
  //   else {
  //     this.dbService.insert('tr_user_used_leaves', this.tr_user_used_leaves_TableInsertOperationConverToDBFormat(this.loginId, this._leaveId, this.totalDays)).subscribe((data) => console.log(data));
  //   }
  // }


  // onSubmitApplyNewLeaveInfoIsconverToDBFormat(_currentDate, _diffDays, _leavetype, _fromdate, _todate, _reason, _userId): any {

  //   var doc = {
  //     dtAppliedDate: _currentDate,
  //     days_requested: _diffDays,
  //     intLeavetype: _leavetype,
  //     dtFromDate: _fromdate,
  //     dtToDate: _todate,
  //     txtReason: _reason,
  //     user_id: _userId,
  //   }
  //   return doc;
  // }


  // tr_user_used_leaves_TableUpdateOperationConverToDBFormat(_usedleave) {
  //   var doc = {
  //     totalLeaves: _usedleave,
  //   }
  //   return doc;
  // }

  // tr_user_used_leaves_TableInsertOperationConverToDBFormat(_registrationId, _leavesId, _totalLeave) {
  //   var doc = {
  //     registrationId: _registrationId,
  //     leaveId: _leavesId,
  //     totalLeaves: _totalLeave,
  //   }
  //   return doc;
  // }


  // onClickEnableNewLeave() {
  //   this.createNewLeave = true;
  //   this.leaveListData = [];
  //   this.usedLeaveListData = [];
  //   //this.loadLeavesDetailedData();
  //   this.loadRefreshData();

  // }

  // onClickBackToList() {
  //   this.createNewLeave = false;
  //   this.myForm.reset();
  // }

  // onClickRegistrationCancel() {
  //   this.log.consoleLog("Cancel Clicked");
  //   this.myForm.reset();
  //   this.createNewLeave = false;
  // }

  // onClickSelectTab(tabNumber) {
  //   this.select = tabNumber;
  //   if (tabNumber === 1) {
  //     this.router.navigate(['/pages/my-actions/my-attendance']);
  //   }
  //   else if(tabNumber === 2) {
  //     this.router.navigate(['/pages/my-actions/my-leaves',]);
  //   }
  //   else{
  //     this.router.navigate(['/pages/my-actions/my-documents',]);
  //   }
  // }


  // /*
  // To find a leave type
  // */
  // txtLeaveTypeName: string;
  // fcnTxtLeaveType(leaveid) {
  //   this.leaveListData.filter((data) => {
  //     if (data.intLeaveId == leaveid) {
  //       this.txtLeaveTypeName = data.txtLeaveType;
  //     }
  //   });
  // }

  // /**
  //  *********************************************************************************************************
  //  ******************************My-Actions Module/leaves code Ended Here**************************************** 
  //  ***********************************************************************************************************
  //  */


}
