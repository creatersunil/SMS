import { Component, OnInit } from '@angular/core';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SnotifyService, SnotifyConfig } from 'ng-snotify';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subscription } from 'rxjs/Subscription';
import { DbService, UserConfig, MessageService, SUCCESS, FAILED, Logs } from '../../../../services';
import { LeavesInfo } from './leavesInfo-Json';
import { LeavesTypeList } from './leavesTypeList-Json';
import { UsedLeaves } from './usedLeaveInfo-Json';
import { HolidayInfo } from './holidayData-Json';

@Component({
  selector: 'app-my-leave',
  templateUrl: './my-leaves.component.html',
  styleUrls: ['./my-leaves.component.scss'],
  providers: [DbService, UserConfig, Logs],
})



export class MyLeavesComponent implements OnInit {

  myForm: FormGroup;
  subscription: Subscription;
  loginId: any;
  public createNewLeave: boolean = false;
  public currentDate: number;


  public leavesDetails: any[] = new Array<LeavesInfo>();
  public leaveListData: any[] = new Array<LeavesTypeList>();
  public usedLeaveListData: any[] = new Array<UsedLeaves>();
  public holidayListData: any[] = new Array<HolidayInfo>();

  /**
   * Below variables are using myForm control
   */
  public intLeavetype: AbstractControl;
  public dtFromDate: AbstractControl;
  public dtToDate: AbstractControl;
  public user_id: AbstractControl;
  public dtAppliedDate: AbstractControl;
  public txtReason: AbstractControl;
  public intStatus: AbstractControl;
  public days_requested: AbstractControl;
  /** 
   * below variables are using the fromDate and todate operation
   */
  public frmdate: any = 0;/***/
  public tdate: any = 0;/**  */
  public diffDays: number = 0;/** */
  public totalDays: number = 0;/** */
  public remainingLeaves: number = 0;/** */
  public startDate: any = 0;/** */
  public endDate: any = 0;/** */
  public totalSundays: number = 0;/** */
  public today: any = 0;/** */
  public minDateFromCurrentDate: any = 0;
  public maxDateFromTodate: any = 0;
  totalMinDate: number = 30;
  totalMaxDate: number = 120;
  public changedFormat_FromDate: any = 0;

  //Leaves Remaining calculation
  public _number_of_leave: number = 0;
  public _totalLeaves: number = 0;
  public _leaveId: number = 0;
  public takenLeaves: number = 0;

  typeId = 1;
  public holidays_startDate: any = 0;
  public holidays_endDate: any = 0;


  constructor(private formBuilder: FormBuilder, private dbService: DbService, private log: Logs,
    private userConfig: UserConfig, private notify: SnotifyService, private router: Router) {

    this.myForm = formBuilder.group({
      // 'intLeavetype': [''],
      'intLeaveId': ['', Validators.required],
      'dtFromDate': ['', Validators.required],
      'dtToDate': ['', Validators.required],
      'txtReason': ['', Validators.required],
      'days_requested': ['', Validators.required],
    });
    this.intLeavetype = this.myForm.controls['intLeaveId'];
    this.dtFromDate = this.myForm.controls['dtFromDate'];
    this.dtToDate = this.myForm.controls['dtToDate'];
    this.txtReason = this.myForm.controls['txtReason'];
    this.days_requested = this.myForm.controls['days_requested'];
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

    /**
     * loadMstHolidaysData() for using load the mst_holiday table from database
     */
    this.loadMstHolidaysData();

  }




  loadMstLeaveData() {
    //mstLeave table data Load
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'intLeaveId,txtLeaveType,intNumberOfLeave');
    this.dbService.query('mstleave', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if (data.resource.length > 0) {
        data.resource.forEach((leaveListData) => {
          this.leaveListData.push(LeavesTypeList.fromJson(leaveListData));
          this.log.consoleLog(this.leaveListData.length);
        });
        this.log.consoleLog(data);
      }
      else {
        this.notify.error("Error", "No Data in DataBase");
      }
    });


    //Load data from tr_user_used_leaves this table stores the used leaves information
    queryFilters.set('fields', 'id,registrationId,leaveId,totalLeaves');
    queryFilters.set('filter', 'registrationId =' + this.loginId);
    this.dbService.query('tr_user_used_leaves', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if (data.resource.length > 0) {
        data.resource.forEach((usedLeaveListData) => {
          this.usedLeaveListData.push(UsedLeaves.fromJson(usedLeaveListData));
          console.log(this.usedLeaveListData.length);
        });
        this.log.consoleLog('consoleLog used leaves');
        this.log.consoleLog(this.usedLeaveListData);
      }
      else {
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
        this.leavesDetails = [];
        if (result.resource.length > 0) {
          result.resource.forEach((item) => {
            this.leavesDetails.push(LeavesInfo.fromJson(item));
          });
        }
        else {
          this.notify.error("Error", "No Data in DataBase");
        }
      }
      this.log.consoleLog(this.leavesDetails);

    });
  }

  loadRefreshData() {
    //mstLeave table data Load
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'intLeaveId,txtLeaveType,intNumberOfLeave');
    this.dbService.query('mstleave', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if (data.resource.length > 0) {
        data.resource.forEach((leaveListData) => {
          this.leaveListData.push(LeavesTypeList.fromJson(leaveListData));
        });
      }
      else {
        this.notify.error("Error", "No Data in DataBase");
      }
    });


    //Load data from tr_user_used_leaves this table stores the used leaves information
    queryFilters.set('fields', 'id,registrationId,leaveId,totalLeaves');
    queryFilters.set('filter', 'registrationId =' + this.loginId);
    this.dbService.query('tr_user_used_leaves', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if (data.resource.length > 0) {
        data.resource.forEach((usedLeaveListData) => {
          this.usedLeaveListData.push(UsedLeaves.fromJson(usedLeaveListData));
        });
      }
      else {
        this.notify.error("Error", "No Data in DataBase");
      }
    });

  }

  loadMstHolidaysData() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'holiday_id,holiday_name,type_id,start_Date,end_Date');
    queryFilters.set('filter', 'type_id =' + this.typeId);
    this.dbService.query('mst_holiday', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      if (data.resource.length > 0) {
        data.resource.forEach((holidayListData) => {
          this.holidayListData.push(HolidayInfo.fromJson(holidayListData));
          this.log.consoleLog(this.holidayListData.length);
        });
        this.log.consoleLog(data);
      }
      else {
        this.notify.error("Error", "No Data in DataBase");
      }
    });
  }

  /**  ************************************************************************************** 
          **************** My-Actions Module/leaves code Started Here*****************
       **************************************************************************************
     */

  formdate(fromvalue: string) {
    this.frmdate = fromvalue;
    this.today = new Date();

    /**
     * Below Variables are using minimum Startdate selection validation
     */
    this.changedFormat_FromDate = new Date(this.frmdate);
    this.minDateFromCurrentDate = this.today.setDate(this.today.getDate() - this.totalMinDate);

    /**This condition is satisfied without selecting Leave type not allowed to select Startdate */
    if (this.intLeavetype.value < 1) {
      (<FormControl>this.myForm.controls['intLeaveId'])
        .setValue(0, { onlySelf: true });
      this.notify.info("Info", "Please First select Leave type.");
    }
    /**This condition is satisfied Not allowed to select below 30 days date from Today date  */
    else if (this.changedFormat_FromDate <= this.minDateFromCurrentDate) {
      (<FormControl>this.myForm.controls['dtFromDate'])
        .setValue(0, { onlySelf: true });
      this.notify.info("Info", "Not allowed to select below 30 days dates from Today date");
    }

    /**This condition is satisfied Not allowed to select above 120 days dates from Today date */
    this.maxDateFromTodate = this.today.setDate(this.today.getDate() + this.totalMaxDate);
    if (this.changedFormat_FromDate >= this.maxDateFromTodate) {
      (<FormControl>this.myForm.controls['dtFromDate'])
        .setValue(0, { onlySelf: true });
      this.notify.info("Info", "Not allowed to select above 120 days dates from Today date");
    }

  }

  todate(todayvalue: string) {
    this.tdate = todayvalue;
    /**calculate total number of days difference beetween startDate and toDate */
    var date1 = new Date(this.frmdate);
    var date2 = new Date(this.tdate);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    /**This condition is satisfied To Date should be greater than From date*/
    if (date1 > date2) {

      (<FormControl>this.myForm.controls['dtFromDate'])
        .setValue(0, { onlySelf: true });
      (<FormControl>this.myForm.controls['dtToDate'])
        .setValue(0, { onlySelf: true });

      this.notify.info("Info", "End Date should be greater than Start date");

    }
    else {

      //calculate total days excluding Sunday this code here
      this.startDate = new Date(this.frmdate);
      this.endDate = new Date(this.tdate);
      this.totalSundays = 0;
      this.totalDays = 0;
      for (var i = this.startDate; i <= this.endDate;) {
        if (i.getDay() == 0) {
          this.totalSundays++;
        }
        i.setTime(i.getTime() + 1000 * 60 * 60 * 24);
      }
      this.log.consoleLog('******************Sunday*********************');
      this.log.consoleLog(this.totalSundays);

      this.totalDays = (this.diffDays - this.totalSundays) + 1;


      /////////////////////////////////////////////////////////////////////////////
      // this.holidayListData.filter((holidays) => {
      //   var formatholidate=new Date(holidays.start_Date);
      //   this.log.consoleLog("++++++++++"+formatholidate);
      //   if(formatholidate==this.startDate){
      //   for (var j = this.startDate; j <= this.endDate;) {
      //     this.log.consoleLog("jjjjjjjjj"+j);
      //     //if (formatholidate == j) {
      //       this.holidays_startDate = 0;
      //       this.holidays_endDate = 0;

      //       this.holidays_startDate = holidays.start_Date;
      //       this.holidays_endDate = holidays.end_Date;
      //       var hStart = new Date(this.holidays_startDate);
      //       var hEnd = new Date(this.holidays_endDate);
      //       var hDiff = Math.abs(hEnd.getTime() - hStart.getTime());
      //       var hdiffDays = Math.ceil(hDiff / (1000 * 3600 * 24));
      //       this.log.consoleLog('***************************************');
      //       this.log.consoleLog(hStart);
      //       this.log.consoleLog(hEnd);
      //       this.log.consoleLog(hdiffDays);
      //   //  }
      //     j.setTime(j.getTime() + 1000 * 60 * 60 * 24);
      //   }
      // });

      //////////////////////////////////////////////////////////////////////////////////////////


      //Remaining days validation
      if (this.totalDays > this.remainingLeaves) {
        // window.confirm('You have only '+this._remainingLeaves+' Remaining leaves');
        (<FormControl>this.myForm.controls['dtFromDate'])
          .setValue(0, { onlySelf: true });
        (<FormControl>this.myForm.controls['dtToDate'])
          .setValue(0, { onlySelf: true });
        this.totalDays = 0;
        this.diffDays = 0;
        this.notify.info("Info", "You have only " + this.remainingLeaves + " Remaining Days.")
      }
      else {
        (<FormControl>this.myForm.controls['days_requested'])
          .setValue(this.totalDays, { onlySelf: true });
      }

      this.log.consoleLog('totalDays:' + this.totalDays);

    }

  }


  onSelectRemainingDays(leaveid) {
    this._leaveId = leaveid;

    //fiter already loaded mstleave table data//////////

    this.leaveListData.filter((mst_leaveData) => {
      if (mst_leaveData.intLeaveId == leaveid) {
        this._number_of_leave = mst_leaveData.intNumberOfLeave;
        this.log.consoleLog(this._number_of_leave);
      }
    });

    //filter already loaded tr_user_used_leaves table data///////////////

    this.usedLeaveListData.filter((usedleaveData) => {
      if (usedleaveData.leaveId == leaveid && this.loginId == usedleaveData.registrationId) {
        this._totalLeaves = usedleaveData.totalLeaves;
        this.log.consoleLog(this._totalLeaves);
      }
    });
    this.remainingLeaves = (this._number_of_leave) - (this._totalLeaves);
    this.log.consoleLog('_remainingLeaves');
    this.log.consoleLog(this.remainingLeaves);
    this.takenLeaves = this._totalLeaves;


    this._totalLeaves = 0;
    this.fcnTxtLeaveType(leaveid);
  }


  //Press Submit button onClickNewLeaveSubmit() will Execute
  //leave data inserted to database
  onClickNewLeaveSubmit() {
    this.log.consoleLog(this.myForm.getRawValue());
    this.dbService.insert('tbl_staff_leaves', this.onSubmitApplyNewLeaveInfoIsconverToDBFormat(this.currentDate, this.totalDays, this.intLeavetype.value, this.dtFromDate.value, this.dtToDate.value, this.txtReason.value, this.loginId)).subscribe((data) => {
      if (data.resource.length > 0) {
        this.onSubmitUsedLeaves();
        this.leavesDetails.push(new LeavesInfo(data.resource.leaveid, this.dtFromDate.value, this.dtToDate.value, this.intLeavetype.value, this.days_requested.value, 0, this.txtLeaveTypeName));
        this.resetAllvalus();
        console.log(data);
        //Success notification
        this.notify.success("Success", data.resource.length + " Leave is Applied");
      }
      else {
        this.notify.error("Error", "Somthing went wrong!!");
      }
    });
  }

  resetAllvalus() {
    this.myForm.reset();
    this._number_of_leave = 0;
    this._totalLeaves = 0;
    this.takenLeaves = 0;
    this.remainingLeaves = 0;
    this.totalDays = 0;
    this.diffDays = 0;
    this.createNewLeave = false;
  }

  public _usedleaveas: number = 0;
  public isExist: boolean = false;
  onSubmitUsedLeaves() {
    this.log.consoleLog('tr_user_used_leaves Data update and Insert');
    this.usedLeaveListData.filter((usedleaveData) => {
      if (usedleaveData.leaveId == this._leaveId && this.loginId == usedleaveData.registrationId) {
        //this.user_usedLeaves_leaveid=usedleaveData.leaveId;
        this._usedleaveas = (usedleaveData.totalLeaves) + (this.totalDays);
        this.isExist = true;
        this.log.consoleLog(this._usedleaveas);
      }
    });
    this.usedTableNewLeaveORAllReadyExitsLeaveTypeInsertOrUpadateOperation(this.isExist);
  }


  usedTableNewLeaveORAllReadyExitsLeaveTypeInsertOrUpadateOperation(ioru: boolean) {
    var queryFilters = new URLSearchParams();
    if (ioru == true) {
      queryFilters.set('filter', 'leaveid= ' + this._leaveId);
      this.dbService.update('tr_user_used_leaves', this.tr_user_used_leaves_TableUpdateOperationConverToDBFormat(this._usedleaveas), queryFilters).subscribe((data) => {
        this.log.consoleLog(data);
      });
    }
    else {
      this.dbService.insert('tr_user_used_leaves', this.tr_user_used_leaves_TableInsertOperationConverToDBFormat(this.loginId, this._leaveId, this.totalDays)).subscribe((data) => console.log(data));
    }
  }


  onSubmitApplyNewLeaveInfoIsconverToDBFormat(_currentDate, _diffDays, _leavetype, _fromdate, _todate, _reason, _userId): any {

    var doc = {
      dtAppliedDate: _currentDate,
      days_requested: _diffDays,
      intLeavetype: _leavetype,
      dtFromDate: _fromdate,
      dtToDate: _todate,
      txtReason: _reason,
      user_id: _userId,
    }
    return doc;
  }


  tr_user_used_leaves_TableUpdateOperationConverToDBFormat(_usedleave) {
    var doc = {
      totalLeaves: _usedleave,
    }
    return doc;
  }

  tr_user_used_leaves_TableInsertOperationConverToDBFormat(_registrationId, _leavesId, _totalLeave) {
    var doc = {
      registrationId: _registrationId,
      leaveId: _leavesId,
      totalLeaves: _totalLeave,
    }
    return doc;
  }


  onClickEnableNewLeave() {
    this.createNewLeave = true;
    this.leaveListData = [];
    this.usedLeaveListData = [];
    //this.loadLeavesDetailedData();
    this.loadRefreshData();

  }

  onClickBackToList() {
    this.createNewLeave = false;
    this.myForm.reset();
  }

  onClickRegistrationCancel() {
    this.log.consoleLog("Cancel Clicked");
    this.myForm.reset();
    this.createNewLeave = false;
  }


  /*
  To find a leave type
  */
  txtLeaveTypeName: string;
  fcnTxtLeaveType(leaveid) {
    this.leaveListData.filter((data) => {
      if (data.intLeaveId == leaveid) {
        this.txtLeaveTypeName = data.txtLeaveType;
      }
    });
  }

  /**
   *********************************************************************************************************
   ******************************My-Actions Module/leaves code Ended Here**************************************** 
   ***********************************************************************************************************
   */
}
