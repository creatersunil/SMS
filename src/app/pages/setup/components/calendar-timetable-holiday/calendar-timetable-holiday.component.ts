import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl, FormsModule } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as jQuery from 'jquery';
import * as _ from 'lodash';

//Import Classes
import { CalendarService } from './calendar.service';
import { DbService, Logs, UserConfig } from '../../../../services';
import { UtilsService } from '../../../../utils/utils.service';
import { CalenderHoliday } from './calender-holiday';


// import { RegistrationLoadType } from '../class-subject-teacher/registrationtableload';
import { Classes } from '../../../../services';
import { Subjects } from './subject';
import { Sections } from '../../../../services';
import { MstTimings } from './mst-timings';
import { MstWorkingHrs } from './cls-mst-working-hrs';
import { MstWeekDays } from './cls-mst-week';

import { SnotifyService, SnotifyPosition, SnotifyModule, SnotifyToast } from 'ng-snotify';


import { SubjectWeeklyHrs } from './cls_sub_weekly_hrs';
import { TeacherWeeklyHrs } from './cls_tchr_weekly_hrs';
import { TimeTable } from './cls_timetable';
import { TeachersList } from './teachers-and-skill-list'
import { TimeTable as TIMETABLE } from './timetable';

@Component({
  selector: 'app-calendar-timetable-holiday',
  templateUrl: './calendar-timetable-holiday.component.html',
  styleUrls: ['./calendar-timetable-holiday.component.scss', '../class-subject-teacher/class-subject-teacher.component.scss'],
  providers: [DbService, Logs, UserConfig, UtilsService]
})



export class CalendarTimetableHolidayComponent implements OnInit, AfterViewInit, OnDestroy {


  _TAB_CALENDER = 1;  // tabs order
  _TAB_HOLIDAY = 2;
  _TAB_TIMETABLE = 3;

  public timetable_status:any;

  public calender_type_id: number = 2; /// Calender Data
  public holiday_type_id: number = 1;  /// Holiday Data
  public select: number = 1;
  public editMode1: boolean = false;
  public editMode2: boolean = false;
  public editMode3: boolean = false;
  public enableAdditionCalHol: boolean = false;
  public titleData: string = '';
  public startDate: Date;
  public endDate: Date;
  public openCalender: boolean = false;
  public event_enabled: boolean = true;
  public loginId: number;

  public count: number = 0;

  public calendarConfiguration: any;
  private _calendar: Object;

  //Arrays
  public calenderHolidayData: any = [];
  public calenderDataArray: any = [];
  public holidayDataArray: any = [];
  public holidayCalenderInsertMstdbData: any = []
  public holidayCalenderUpdateMstdbData = [];
  public date: Date;

  //Timetable Data
  public classes: any[] = new Array<Classes>();
  public subjects: any[] = new Array<Subjects>();
  public sections: any[] = new Array<Sections>();
  public classTimings: any[] = new Array<MstTimings>();
  public classTimingsApend: any[] = new Array<MstTimings>();
  public teachersList: any[] = new Array<TeachersList>();
  public enabled: number = 1;

  private classTimingLength: number = 0;
  private workingDays: any[] = new Array<MstWeekDays>();

  public color = "#ccccff"
  public position = SnotifyPosition.right_bottom;
  private sNotifyID = 0;

  public arr_RemovedTimings = [];
  public enabledSubjects: any[] = new Array<Subjects>();

  // forms for collecting school working hours.

  public frm_working_hrs: FormGroup;
  public _selected_class: any;         // hold current class details
  public _selected_section: any;       // hold current section details

  // CONSTANTS

  _BREAK = "break";
  _PERIOD = "period"
  _LUNCH = "lunch";

  // Tables used list

  _M_TIMETABLE = 'timetable'; // monogo db timetable.



  // Array to hold subject weekly hours and teacher weekly hours.

  private sub_week_hrs: any[] = new Array<SubjectWeeklyHrs>();
  private sub_week_hrs_split: any[] = new Array<any>();
  private tchr_week_hrs: any[] = new Array<TeacherWeeklyHrs>();

  public dbInProgreess: boolean = false;   // show loading animation if any db operation in progress.
 
  public class_ref:any;


  @ViewChild('timetable') ref_timetable;
  @ViewChild('class_ele_ref') class_ele_ref;  // hold current class ref_elenment

  constructor(private _calendarService: CalendarService, private formBuilder: FormBuilder,
    private router: Router, private log: Logs, private userConfig: UserConfig,
    private dbService: DbService, private renderer: Renderer, private utilService: UtilsService,
    private notify: SnotifyService) {
 

    this.dbService.getDateTime('getDate').subscribe((date) => {
      this.date = date;
    });


    // create a forms for workingHours

    this.frm_working_hrs = this.formBuilder.group({
      'start_time': ['', Validators.required],
      'end_time': ['', Validators.required],
      'break': ['', Validators.required],
      'lunch': ['', Validators.required],
      'period_duration': ['', Validators.required]
    });

    jQuery('#calendar').fullCalendar({
      timezone: 'Asia/Kolkata', displayEventTime: true

    });

    this.timetable_status="--------";

  }

/**
 * Change btn class on click 
 * 
 */

 setBtnClass(){

  
    if(this.class_ele_ref === this.class_ref)
       return "btn btn-sm btn-primary";
    else
      return "classbtn";
 }

 /**
  * set the btn style
  */

  setClickRef(ref:any){
    
    this.class_ref = ref;

    this.log.consoleLog(ref);

  }
  

  ngOnInit() {
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });

    this.loadCalenderHolidayData();
    this.loginId = this.userConfig.getRegId();

  }


  ngAfterViewInit() {
    this.log.consoleLog("after init");
   

  }


  /*
 Change global configuration
  */
  setGlobal() {
    this.notify.setConfig({

    }, {
        // newOnTop: this.newTop,
        position: this.position,
        // maxOnScreen: this.dockMax,
        // maxHeight: this.maxHeight
      });
  }





  public onCalendarReady(calendar): void {
    this._calendar = calendar;
  }

  /** Switch the tab based on tab number
   * 
   * @param tabNumber 
   */

  onClickSelectTab(tabNumber) {
    this.select = tabNumber;
   

    if (tabNumber == this._TAB_HOLIDAY || tabNumber ==  this._TAB_CALENDER) {
           this.calenderDataToBeDisplayed(tabNumber);
    }
    if (tabNumber == this._TAB_TIMETABLE) {
      
      this.onLoadClassSectionsubjects();     
      this.onLoadMstWorkingHours();
      this.loadWorkingDays();     
      this.loadSubjectWeekHours();
      this.loadTeacherWeekHours();

    }

  }

  // Holiday
  onClickHolidayEdit() {
    this.editMode1 = true;
  }

  onClickHolidayApproval() {
    console.log("OK Approval")
  }


  /**
   * ON click cancel button on holiday tab revert to original form
   */
  onCilckHolidayCancel() {
    this.editMode1 = false;
    this.calenderDataArray = [];
    this.holidayDataArray = [];
    this.holidayCalenderInsertMstdbData = []
    this.holidayCalenderUpdateMstdbData = [];
    this.calenderHolidayStoredData();
  }


  // Calender
  onClickCalenderEdit() {
    this.editMode2 = true;
  }

  onClickCalenderApproval() {
    this.log.consoleLog("OK Approval");
  }

  /**
   * ON click cancel button on Calender tab revert to original form
   */
  onCilckCalenderCancel() {
    this.editMode2 = false;
    this.calenderDataArray = [];
    this.holidayDataArray = [];
    this.holidayCalenderInsertMstdbData = []
    this.holidayCalenderUpdateMstdbData = [];
    this.calenderHolidayStoredData();
  }


  /**
   * Load subject weekly hours
   */


  loadSubjectWeekHours() {

    this.sub_week_hrs = [];
    this.sub_week_hrs_split = [];
    let params: URLSearchParams = new URLSearchParams();
    params.set('order', 'hours DESC');

    this.dbService.queryMongo('v_subject_total_hrs','', params).subscribe((data) => {
      data = data.json();

      this.log.consoleLog(data);


      let i = 1
      data.resource.forEach(element => {

        this.sub_week_hrs.push(SubjectWeeklyHrs.fromJson(element));

        if (i == 4) {
          this.sub_week_hrs_split.push(this.sub_week_hrs);
          this.sub_week_hrs = [];
          i = 0
        }
        i = i + 1;

      });

      this.sub_week_hrs_split.push(this.sub_week_hrs);



    }), ((Error) => {
      this.log.consoleLog(Error);
    });

  }



  /**
   * 
   * Load teacher weekly hours
   */

  loadTeacherWeekHours() {

    this.tchr_week_hrs = [];
    let params: URLSearchParams = new URLSearchParams();
    params.set('order', 'hours DESC');

    this.dbService.queryMongo('v_teacher_wrk_hrs','', params).subscribe((data) => {
      data = data.json();
      this.log.consoleLog(data);

      data.resource.forEach(element => {

        this.tchr_week_hrs.push(TeacherWeeklyHrs.fromJson(element));
      });

    }), ((Error) => {
      this.log.consoleLog(Error);
    });

  }




  /**
   * 
   * @param calHolData Data of Calender and Holiday where remove Button clicked
   * This removes the newly added events and disables the already present events
   */
  onRemoveHoliday(calHolData) {
    this.position = SnotifyPosition.center_center;
    this.setGlobal();
    if (this.sNotifyID > 0) {
      this.notify.remove(this.sNotifyID);
    }
    this.sNotifyID = this.notify.confirm("Confirm", "Do you want to Remove Event", {
      timeout: 0,
      // position:SnotifyPosition.center_center,
      closeOnClick: true,
      pauseOnHover: true,
      buttons: [
        {
          text: 'Yes', action: () => {
            if (calHolData.type_id == 1) {
              if (calHolData.holiday_id > 0) {
                this.log.consoleLog(calHolData);
                this.holidayDataArray.splice(this.holidayDataArray.indexOf(calHolData), 1);
                this.log.consoleLog(this.calenderHolidayCancelData);
                this.log.consoleLog(this.calenderHolidayData);
                this.calenderHolidayCancelData.filter((data) => {
                  if (data.holiday_id == calHolData.holiday_id) {
                    this.calenderHolidayCancelData.splice(this.calenderHolidayCancelData.indexOf(data), 1);
                  }
                })
                this.log.consoleLog(this.calenderHolidayCancelData);
                this.holidayCalenderUpdateMstdbData.push(this.onDisableExistingEvent(calHolData.holiday_id, !this.event_enabled));
                this.log.consoleLog(this.holidayCalenderUpdateMstdbData);
              }
              else {
                this.holidayDataArray.splice(this.holidayDataArray.indexOf(calHolData), 1);
                this.log.consoleLog("HolData");
                this.holidayCalenderInsertMstdbData.splice(this.holidayCalenderInsertMstdbData.indexOf(calHolData), 1);
                this.log.consoleLog(this.holidayDataArray);
                this.log.consoleLog(this.holidayCalenderInsertMstdbData);
              }
            }

            if (calHolData.type_id == 2) {
              if (calHolData.holiday_id > 0) {
                this.log.consoleLog(calHolData);
                this.holidayCalenderUpdateMstdbData.push(this.onDisableExistingEvent(calHolData.holiday_id, !this.event_enabled));
                this.calenderDataArray.splice(this.calenderDataArray.indexOf(calHolData), 1);
                this.log.consoleLog(this.calenderDataArray);
                this.calenderHolidayCancelData.filter((data) => {
                  if (data.holiday_id == calHolData.holiday_id) {
                    this.calenderHolidayCancelData.splice(this.calenderHolidayCancelData.indexOf(data), 1);
                  }
                })
              }
              else {
                this.calenderDataArray.splice(this.calenderDataArray.indexOf(calHolData), 1);
                this.holidayCalenderInsertMstdbData.splice(this.holidayCalenderInsertMstdbData.indexOf(calHolData), 1);
                this.log.consoleLog("Calender data");
                this.log.consoleLog(this.calenderDataArray);
                this.log.consoleLog(this.holidayCalenderInsertMstdbData);
              }
            }; this.notify.remove(this.sNotifyID);
          }, bold: true
        },

        { text: 'No', action: () => { console.log('Not Removed Data'); this.notify.remove(this.sNotifyID); }, bold: true },
      ]
    });
    // this.log.consoleLog(id);


  }

  onDisableExistingEvent(_holiday_id, _event_enabled) {
    var doc = {
      holiday_id: _holiday_id,
      event_enabled: _event_enabled,
    }
    return doc;
  }


  // classes = [
  //   { value: 1, viewValue: 'I' },
  //   { value: 2, viewValue: 'II' },
  //   { value: 3, viewValue: 'II' },
  //   { value: 4, viewValue: 'IV' },
  //   { value: 5, viewValue: 'V' },
  //   { value: 6, viewValue: 'VI' },
  //   { value: 7, viewValue: 'VII' },

  // ]

  // sections = [
  //   { value: 1, viewValue: 'A' },
  //   { value: 2, viewValue: 'B' },
  //   { value: 3, viewValue: 'C' },
  //   { value: 4, viewValue: 'D' },
  // ]



  /**
   * 
   * @param start Start date when clicked on day on calender
   * @param end  End date when cliced on day on caleneder
   */
  onCalenderClick(start, end) {
    /**
     * condition to not  allow to select previous days 
     */
    if (start.isBefore(this.date)) {
      jQuery('#calendar').fullCalendar('unselect');
      this.startDate = null;
      this.endDate = null;
      return false;
    }
    this.enableAdditionCalHol = true;
    this.startDate = start;
    this.endDate = end;
    this.log.consoleLog(start);
    this.log.consoleLog(end);
  }


  /**
   * Once clicked on done button the data is added to calender and store in arrays to insert database
   */
  onClickDone(description) {
    this.log.consoleLog(this.color);
    this.log.consoleLog(this.select);
    this.count = this.count + 1;

    if (this._calendar != null && this.titleData.trim() != '') {
      // let title = prompt('Event Title:');
      let eventData;
      if (this.titleData) {
        eventData = {
          title: this.titleData,
          start: this.startDate,
          end: this.endDate
        };

        jQuery(this._calendar).fullCalendar('renderEvent', eventData, true);
      }
      jQuery(this._calendar).fullCalendar('unselect');
      if (this.select == 1) {
        let typeName: string = "Holiday";
        this.holidayCalenderInsertMstdbData.push(this.holidayCalenderDataInsertMstDoc(description, typeName, this.count));
        this.holidayDataArray.push(new CalenderHoliday(this.startDate, this.endDate, 0, 2017, description, this.select, this.titleData, typeName, this.color, this.count));
      }
      else if (this.select == 2) {
        let type_name: string = "Calender";
        this.holidayCalenderInsertMstdbData.push(this.holidayCalenderDataInsertMstDoc(description, type_name, this.count));
        this.calenderDataArray.push(new CalenderHoliday(this.startDate, this.endDate, 0, 2017, description, this.select, this.titleData, type_name, this.color, this.count));
      }
      this.log.consoleLog(this.holidayCalenderInsertMstdbData);
      this.log.consoleLog("Created");
    }
    this.enableAdditionCalHol = false;
    this.startDate = null;
    this.endDate = null;
    this.titleData = '';

  }


  /**
   * Loads The Data of Calender and Holiday from data base based on condition where data is enabled
   * Stored the data in an anray 
   */
  calenderHolidayCancelData: any = [];
  loadCalenderHolidayData() {
    this.dbInProgreess = true;
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'event_enabled =' + this.event_enabled);
    this.dbService.query('mst_holiday', '', queryFilters).subscribe((result) => {

      {
        result = result.json();
        result.resource.forEach((item) => {
          this.calenderHolidayData.push(CalenderHoliday.fromJson(item));
        });
      }
      this.log.consoleLog(this.calenderHolidayData);
      this.calenderHolidayCancelData = _.cloneDeep(this.calenderHolidayData);
      this.calenderHolidayStoredData();
      this.dbInProgreess = false;
    });

  }

  /**
   * Sepearates the data which is recived from database in to two arrays as Calender Data and Holiday data
   * And the Data is seperated in Shown in both Holiday and Calender Pages
   */
  calenderHolidayStoredData() {
    this.log.consoleLog(this.calenderHolidayData);
    this.calenderHolidayData.filter((data) => {
      if (data.type_id == this.calender_type_id) {
        this.calenderDataArray.push(data);
      }
      else {
        this.holidayDataArray.push(data);
      }

      if (this.select == 1) {
        this.calendarConfiguration = this._calendarService.getData(this.holidayDataArray);
        this.calendarConfiguration.select = (start, end) => this.onCalenderClick(start, end);
      }
      else if (this.select == 2) {
        this.calendarConfiguration = this._calendarService.getData(this.calenderDataArray);
        this.calendarConfiguration.select = (start, end) => this.onCalenderClick(start, end);
      }


    });
    this.log.consoleLog(this.calenderDataArray);
    this.log.consoleLog(this.holidayDataArray);
    this.openCalender = true;
  }

  /**
   * 
   * @param id On select Select Tab
   * ON Chage between Both Holiday and Calender Tabs in UI
   */
  calenderDataToBeDisplayed(id) {
    if (id == 1) {
      this.log.consoleLog(id);
      this.log.consoleLog(this.holidayDataArray)
      this.calendarConfiguration = this._calendarService.getData(this.holidayDataArray);
      this.calendarConfiguration.select = (start, end) => this.onCalenderClick(start, end);
    }
    else if (id == 2) {
      this.log.consoleLog(id);
      this.log.consoleLog(this.calenderDataArray);
      this.calendarConfiguration = this._calendarService.getData(this.calenderDataArray);
      this.calendarConfiguration.select = (start, end) => this.onCalenderClick(start, end);
    }
  }

  // Doc to insert Data to Database
  holidayCalenderDataInsertMstDoc(_holiday_Desc, _type_name, _unique_no) {
    var doc = {
      holiday_Desc: _holiday_Desc,
      type_id: this.select,
      holiday_name: this.titleData,
      edited_By_Id: this.loginId,
      type_name: _type_name,
      start_Date: this.startDate,
      end_Date: this.endDate,
      created_By_ID: this.loginId,
      event_enabled: true,
      event_color: this.color,
      unique_no: _unique_no
    }
    return doc;
  }


  /**
   * ON click Holiday Save the Data will be stored to Data Base 
   */
  onClickHolidaySave() {
    this.editMode1 = false;
    this.position = SnotifyPosition.right_bottom;
    this.setGlobal();
    if (this.holidayCalenderInsertMstdbData.length > 0) {
      this.dbService.insert('mst_holiday', this.holidayCalenderInsertMstdbData).subscribe((data) => {
        this.log.consoleLog(data);
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Inserted");

        }
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }


    if (this.holidayCalenderUpdateMstdbData.length > 0) {
      this.dbService.update('mst_holiday', this.holidayCalenderUpdateMstdbData, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
          this.calenderHolidayData = _.cloneDeep(this.calenderHolidayCancelData);
          this.log.consoleLog(this.calenderHolidayData);
        }
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });

    }
    this.holidayCalenderInsertMstdbData = [];
    this.holidayCalenderUpdateMstdbData = [];
  }

  /**
   * ON click Calender Save the Data will be stored to Data Base 
   */
  onClickCalenderSave() {
    this.editMode2 = false;
    this.editMode1 = false;
    this.position = SnotifyPosition.right_bottom;
    this.setGlobal();
    if (this.holidayCalenderInsertMstdbData.length > 0) {
      this.dbService.insert('mst_holiday', this.holidayCalenderInsertMstdbData).subscribe((data) => {
        this.log.consoleLog(data);
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Inserted");
        }
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }

    if (this.holidayCalenderUpdateMstdbData.length > 0) {
      this.dbService.update('mst_holiday', this.holidayCalenderUpdateMstdbData, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
          this.calenderHolidayData = _.cloneDeep(this.calenderHolidayCancelData);
          this.log.consoleLog(this.calenderHolidayData);
        }

      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }
    this.holidayCalenderInsertMstdbData = [];
    this.holidayCalenderUpdateMstdbData = [];
  }





  onColorChange(event) {
    this.log.consoleLog(event);
  }


  //====================================================================================================================
  /**
   * Time table code
   * 
   * 
   */


  // private addTimeTable: any[] = new Array<TimeTable>();    // used for adding new time table
  // private updateTimeTable: any[] = new Array<TimeTable>(); // used for updating existing time table
  private loadTimeTable: any[] = new Array<TimeTable>();   // load time table for class and sections.




  // Timetable
  enableEmptyTable = false;
  onClickTimetableEdit() {
    this.editMode3 = true;
    this.loadTeacherSkills();
  }
  onClickTimetableApproval() {
    this.log.consoleLog("Appproval");
  }


  /**
   * Save the time table which is edited and newly added to mongodb.
   * 
   */



  onClickTimetableSave() {

    let timetableInsert = [];
    let timetableUpdate = [];

    this.log.consoleLog(TIMETABLE.getTimeTableList());


    timetableUpdate = TIMETABLE.getUpdateTimeTableList();
    timetableInsert = TIMETABLE.getNewTimeTableList();


    this.log.consoleLog(timetableUpdate);

    this.log.consoleLog(timetableInsert);

    // below will get the newly added time table list

    if (timetableInsert.length > 0) {
      this.dbService.insertMongo(this._M_TIMETABLE, timetableInsert).subscribe((result) => {

        this.log.consoleLog(result);
        this.sNotifyID = this.notify.info("Success!", result.resource.length + " Records added to Timetable");

        if(timetableUpdate==null||timetableUpdate.length <=0){
          this.loadClassTimeTable(this._selected_class.class_id,this._selected_section.section_id);
        }
      });

    }

    // below function will give us the time tables which need to updated. 
    if (timetableUpdate.length > 0) {
      this.dbService.updateMongo(this._M_TIMETABLE, timetableUpdate, '').subscribe((result) => {

        this.log.consoleLog(result);
        this.sNotifyID = this.notify.info("Success!", result.resource.length + " Records update in Timetable");
        this.loadClassTimeTable(this._selected_class.class_id,this._selected_section.section_id);
      });
    }

    timetableUpdate=null;
    timetableInsert=null;
    
    this.editMode3 = false;

  

  }

  onClickEnableCreateTimetable() {
    this.enableEmptyTable = true;
  }


  /// setup working hours
  onClickCreateTimetableSave() {
    this.enableEmptyTable = false;
    this.log.consoleLog(JSON.stringify(this.frm_working_hrs.getRawValue()));
    this.log.consoleLog(this.workingHoursDoc());
    var queryFilters = new URLSearchParams;
    queryFilters.set('filter', 'row_id =' + this.mstWorkingHours.row_id);
    this.dbService.update('mst_working_hours', this.workingHoursDoc(), queryFilters).subscribe((data) => {
      if (data.resource.length > 0) {
        this.notify.info("Success", data.resource.length + " Records Updated");
      }

    }, (error) => {
      this.notify.error("Ahh Crap!!", "Something went wrong !!");
    });


    // insert the timings to mst_timings table.

    if (this.classTimings.length > 0 && this.classTimingsApend.length == this.classTimings.length) {
      this.dbService.insert('mst_timings', this.classTimings).subscribe((insertResponse) => {

        if (insertResponse.resource.length > 0) {
          this.notify.info("Success", insertResponse.resource.length + " Records Updated ");
        }

      }, (error) => {
        this.notify.error("Ahh Crap!!", "Something went wrong !!");
      });
    }

    // insert the newly added data to timings table.

    else if (this.classTimingsApend.length > 0) {

      this.dbService.insert('mst_timings', this.classTimingsApend).subscribe((insertResponse) => {

        if (insertResponse.resource.length > 0) {
          this.notify.info("Success", insertResponse.resource.length + " Records Added ");
        }

      }, (error) => {
        this.notify.error("Ahh Crap!!", "Something went wrong !!");
      });
    }

    //clear the extra array.

    this.classTimingsApend = [];


  }

  loadRegidName = [];
  // loadStaffDetails() {

  //   this.dbService.getDataFromProc('mstStaffRecords', '').subscribe((result) => {

  //     {

  //       result.resource.forEach((item) => {
  //         this.loadRegidName.push(RegistrationLoadType.fromJson(item));

  //       });
  //     }
  //     this.log.consoleLog(this.loadRegidName);

  //   });

  // }

  loadWorkingDays() {
      this.dbInProgreess = true;
    var queryFilters = new URLSearchParams;
    queryFilters.set('filter', 'working =' + 1);
    this.dbService.query('mst_week', '', queryFilters).subscribe((result) => {
      this.workingDays=[];
      var data: any = result.json();
      data.resource.forEach((days) => {
        this.workingDays.push(MstWeekDays.fromJson(days));

      });
        this.dbInProgreess = false;
    }, (error) => { this.log.consoleLog(error) ;
      this.notify.error("Something went wrong ","please retry!!");
      this.dbInProgreess = false;
    });


  }

  onLoadClassSectionsubjects() {
    this.dbInProgreess = true;
    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'subject_enabled =' + this.enabled);
    queryFilters.set('fields', 'subject_id,subject_name,subject_enabled');

    this.dbService.query('mst_subjects', '', queryFilters).subscribe((result) => {
      this.subjects =[];
      var data: any = result.json();
      data.resource.forEach((subjects) => {
        this.subjects.push(Subjects.fromJson(subjects));
      });
        this.dbInProgreess = false;
    }, (error) => { this.log.consoleLog(error) ;
      this.notify.error("Something went wrong ","please retry!!");
      this.dbInProgreess = false;
    });


  this.dbInProgreess = true;
    queryFilters.set('filter', 'class_enabled =' + this.enabled)
    queryFilters.set('fields', 'class_id,class_name,class_enabled');
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
       this.classes=[];
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
      });


      this.onSelectClass(this.classes[0]);
      this.loadClassTimeTable(null, null);
      this.dbInProgreess = false;
    }, (error) => { this.log.consoleLog(error) ;
      this.notify.error("Something went wrong ","please retry!!");
      this.dbInProgreess = false;
    });



  this.dbInProgreess = true;
    this.dbService.query('mst_timings', '').subscribe((result) => {
      var data: any = result.json();
      this.classTimings=[];
      data.resource.forEach((timings) => {
        this.classTimings.push(MstTimings.fromJson(timings));
      });
        this.dbInProgreess = false;
    }, (error) => { this.log.consoleLog(error) ;
      this.notify.error("Something went wrong ","please retry!!");
      this.dbInProgreess = false;
    });
    //  this.classTimingLength = this.classTimings.length;

    // this.log.consoleLog(this.classes);
    // this.log.consoleLog(this.sections);
    // this.log.consoleLog(this.subjects);
    // this.log.consoleLog(this.classTimings);
  }

  /**
   * on select class load the relates sections
   *if no sections found show massage.
   * @param _class 
   */

  public class_btn: any;    // used to change the element background color

  onSelectClass(_class) {


    this.dbInProgreess = true;
    // this.log.consoleLog(_class);
    this._selected_class = _class;
    this.loadTimeTable = []; // erase previous time table data
    if (this.editMode3) {
     // TIMETABLE.clearBeforeInsert();
    }
    // ;

    let param = {
      'name': 'class_id',
      'value': _class.class_id
    }
    this.dbService.getDataFromProc('selectSectionWRTClass', param).subscribe((data) => {
      //erase preavious aray data
      this.sections = [];
      data.resource.forEach(section => {
        this.sections.push(Sections.fromJson(section));
      });
      this._selected_section = this.sections[0];

    }, (Error) => { this.errorMessage = Error;
      this.dbInProgreess = false;
    });

    this.dbInProgreess = true;
    this.dbService.getDataFromProc('CLASS_SUBJECTS', param).subscribe((data) => {
      //erase preavious aray data
      this.enabledSubjects = [];
      data.resource.forEach(subject => {

        this.enabledSubjects.push(Subjects.fromJson(subject));
      });
       this.dbInProgreess = false;
    }, (Error) => { this.errorMessage = Error;
       this.dbInProgreess = false;
       });

    this.log.consoleLog(this.enabledSubjects);

    // load skills when user want to add time table to database.

    if (this.editMode3) {
     
      this.loadTeacherSkills();
    }


  }
  errorMessage: any = '';

  
  //Load teacher skills based on selected class and subjects. 

  loadTeacherSkills() {
      this.dbInProgreess = true;
      let subjct_id = [];
      this.enabledSubjects.forEach(sub => {
        subjct_id.push(sub.subject_id);
      });
      this.log.consoleLog(subjct_id.toString());

      let param = {
        'name': 'SUBJECT_CODE',
        'value': subjct_id.toString()
      }
      this.dbService.getDataFromProc('TEACHING_SKILLS', param).subscribe((data) => {
        //erase preavious aray data
        this.teachersList = [];
        data.resource.forEach(teachers => {
          this.teachersList.push(TeachersList.fromJson(teachers));
        });

           this.dbInProgreess = false;
      },(Error) => { this.errorMessage = Error;
       this.dbInProgreess = false;
       });
  }



  onSelectSections(_sections) {
    this.log.consoleLog(_sections);
    this._selected_section = _sections;
    this.loadClassTimeTable(this._selected_class.class_id, _sections.section_id);
  }



  /**
   * Creating a time table record by combining the 2 inputs
   */


  onSelectSubjet(subjectId, array: Array<any>, ref: any) {
    let data: Subjects;
    array.filter(element => {
      if (element.subject_id == subjectId) {
        data = element;
      }
    });

    ref.subject_id = data.subject_id;
    ref.subject_name = data.subject_name;


    this.teacherSKillDataBasedOnPerSkill = this.onLoadSkillDataBasedOnSelectedSkillData(subjectId);

    if (this.teacherSKillDataBasedOnPerSkill.length <= 0) {
      ref.removeTimeTable();
    }

  }
  // onSelectTeacher(teachername, timing, day, index) {
  //   this.log.consoleLog(teachername);
  //   this.log.consoleLog(timing);
  //   this.log.consoleLog(day);
  //   this.log.consoleLog(index);
  // }

  mstWorkingHours: any;
  onLoadMstWorkingHours() {
    var queryFilters = new URLSearchParams();
    this.dbService.query('mst_working_hours', '', queryFilters).subscribe((result) => {

      {
        result = result.json();
        result.resource.forEach((item) => {
          this.mstWorkingHours = MstWorkingHrs.fromJson(item);
        });
      }
      this.log.consoleLog(this.mstWorkingHours);
      this.bindData();

    });

  }

  bindData() {
    (<FormControl>this.frm_working_hrs.controls['start_time'])
      .setValue(this.mstWorkingHours.start_time, { onlySelf: true });
    (<FormControl>this.frm_working_hrs.controls['end_time'])
      .setValue(this.mstWorkingHours.end_time, { onlySelf: true });
    (<FormControl>this.frm_working_hrs.controls['break'])
      .setValue(this.mstWorkingHours._break, { onlySelf: true });
    (<FormControl>this.frm_working_hrs.controls['lunch'])
      .setValue(this.mstWorkingHours.lunch, { onlySelf: true });
    (<FormControl>this.frm_working_hrs.controls['period_duration'])
      .setValue(this.mstWorkingHours.period_duration, { onlySelf: true });
  }

  workingHoursDoc() {
    var doc = {
      start_time: this.frm_working_hrs.getRawValue().start_time,
      end_time: this.frm_working_hrs.getRawValue().end_time,
      lunch: this.frm_working_hrs.getRawValue().lunch,
      break: this.frm_working_hrs.getRawValue().break,
      period_duration: this.frm_working_hrs.getRawValue().period_duration,
      edited_by: this.loginId
    }
    return doc;
  }


  onClickPeriodIcon() {


    let period_dur = this.frm_working_hrs.getRawValue().period_duration;

    this.addTimingsToArray(period_dur, this._PERIOD);


  }

  /**
   * Adding break to school timings
   */

  onClickBreakIcon() {


    let _break = this.frm_working_hrs.getRawValue().break;

    this.addTimingsToArray(_break, this._BREAK);


  }


  /**
   * adding lunch timing
   */
  onClickLunchIcon() {

    let lunch = this.frm_working_hrs.getRawValue().lunch;

    this.addTimingsToArray(lunch, this._LUNCH);


  }


  /**
   * 
   * Clear all the timings from database and define again.
   */
  private notifyId: any;

  onClickDeleteIcon() {

    this.position = SnotifyPosition.center_center;
    this.setGlobal();

    if (this.notifyId > 0)
      this.notify.remove(this.notifyId);
    if (this.classTimings.length > 0)
      this.notifyId = this.notify.confirm('Clear Timings.', 'It will clear all the timings', {
        timeout: 5000,
        showProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        buttons: [
          { text: 'Yes', action: () => this.deleteAllTimingsFromDb(this.notifyId), bold: false },
          { text: 'No', action: () => this.notify.remove(this.notifyId), bold: true },
        ]
      });

  }


  onRemoveTime(item: any) {
    this.log.consoleLog(item);

    this.classTimings.splice(this.classTimings.indexOf(item), 1);

    if (this.classTimingsApend.length > 0) {
      this.classTimingsApend.splice(this.classTimingsApend.indexOf(item), 1);
    }

  }


  deleteAllTimingsFromDb(notifyId: any) {

    if (this.classTimings.length > 0) {
      this.dbService.delete('mst_timings', this.classTimings, null).subscribe((result) => {

        this.log.consoleLog(result);
        this.notify.remove(notifyId);
        this.classTimings = [];
      }, (error) => {
        this.log.consoleLog(error);
        this.notify.error("Ahh Crap!!", "Something went wrong !!");
        this.notify.remove(notifyId);
        this.classTimings = [];
      });
    }
    else {
      this.notify.remove(notifyId);
      this.classTimings = [];
      this.classTimingsApend = [];
    }


 
  }

  /**
   * 
   * add time to array 
   * @param inMinutes 
   * @param type
   */

  public err_notifyId = 0;

  addTimingsToArray(inMinutes: number, type: any) {


    let lastTime = 0;
    let lastTimeName = '';

    if (this.classTimings.length == 0) {
      if (inMinutes >= 60) {
        lastTime = this.frm_working_hrs.getRawValue().start_time - 1;
        lastTimeName = type;
      }
      else {
        lastTime = this.frm_working_hrs.getRawValue().start_time;
        lastTimeName = type;
      }
    }
    else {
      lastTime = this.classTimings[(this.classTimings.length - 1)].timings;
      lastTimeName = this.classTimings[(this.classTimings.length - 1)].name;
    }

    {
      if (lastTimeName == this._PERIOD) {
        inMinutes = this.frm_working_hrs.getRawValue().period_duration;
      }
      if (lastTimeName == this._BREAK) {
        inMinutes = this.frm_working_hrs.getRawValue().break;
      }

      if (lastTimeName == this._LUNCH) {
        inMinutes = this.frm_working_hrs.getRawValue().lunch;
      }
    }

    let timeData = String(lastTime).split(".");
    let hours: number;
    let minutes: number;

    if (timeData.length > 0) {
      hours = Number.parseInt(timeData[0]);
      if (timeData[1] == undefined) { minutes = 0 }
      else { minutes = Number.parseInt((timeData[1])); }
    }

    // console.log(hours);
    //   console.log(minutes);
    // adding new hours and minutes

    let addNewHour: number = 0;
    let newMinutes: number = 0;

    if (inMinutes == 60) {
      addNewHour = ((inMinutes / 60) + hours);
      newMinutes = minutes;
    }
    else {
      newMinutes = inMinutes + minutes;
      addNewHour = hours;
    }

    // add minutes to time


    // console.log(newMinutes + " New Minu");

    if (newMinutes < 60) {
      addNewHour = (newMinutes / 100) + addNewHour;
      // console.log(" new Hour" + addNewHour);
    }
    else if (newMinutes >= 60) {

      let minToHr = Math.round((newMinutes / 60) * 100.0) / 100.0;
      //  console.log(minToHr);

      let hrmin = new String(minToHr).split(".");

      //  console.log("Hour : " + hrmin[0]);

      //  console.log("Min :" + hrmin[1]);

      if (hrmin[0] != undefined) {

        addNewHour = addNewHour + (Number.parseInt((hrmin[0])))
        //  console.log(addNewHour);
      };
      if (hrmin[1] != undefined) {
        let temp: number = Number.parseInt(hrmin[1]);
        temp = temp / 100;
        newMinutes = temp * 60;
        //  console.log("Final Min " + newMinutes);
      }
      else {
        newMinutes = 0;
      }

      addNewHour = addNewHour + (Math.round(newMinutes) / 100);


    }

    let hrObj: Number = addNewHour;
    //  console.log("Final Hour"+ hrObj.toFixed(2));


    //check school end time before adding periods. 
    let schoolEndTime = this.frm_working_hrs.getRawValue().end_time;
    if (addNewHour <= schoolEndTime) {

      let row = this.classTimings.length;
      row = row == 0 ? 1 : row + 1;

      this.classTimings.push(new MstTimings(row, hrObj.toFixed(2), type));
      this.classTimingsApend.push(new MstTimings(row, hrObj.toFixed(2), type));

    } else {

      if (this.err_notifyId > 0) { this.notify.remove(this.err_notifyId) };

      this.err_notifyId = this.notify.warning('Attention!.', 'time slot exceeding school end time', {
        timeout: 2000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
      });
    }

  }


  /**
   * 
   * Clean up all the objects.
   */

  ngOnDestroy() {

    //this.addTimeTable = null;
    this.addTimingsToArray = null;
    // this.updateTimeTable = null;
    this.calenderDataArray = null;
    this.addTimingsToArray = null;
    this.arr_RemovedTimings = null;
    this.tchr_week_hrs = null;
    this.sub_week_hrs = null;
    this.holidayCalenderInsertMstdbData = null;
    this.holidayCalenderUpdateMstdbData = null;
    this.holidayDataArray = null;
    this.loadCalenderHolidayData = null;
    this.loadRegidName = null;
    // this.loadStaffDetails = null;
    this.loadTimeTable = null;

  }


  /**
   *  load time table of perticular class and sections. 
   */

  loadClassTimeTable(class_id?, section_id?) {

    this.dbInProgreess =true;
    this.log.consoleLog(class_id + "  : class ID " + section_id + " : section id");
    this.loadTimeTable = [];
    if (this.editMode3) {
      TIMETABLE.clearBeforeInsert();
    }



    if ((class_id != null && class_id != undefined) && (section_id != null && section_id != undefined)) {
      let params: URLSearchParams = new URLSearchParams();
      params.set('filter', '(class_id =' + class_id + ') AND (section_id =' + section_id + ')');
      params.set('order', 'time_start');
      this.dbService.queryMongo('timetable', '', params).subscribe((data) => {

        data = data.json();
        this.log.consoleLog("Load Time table")
        this.loadTimeTable = [];


        if (data.resource.length > 0) {
          data.resource.forEach(element => {
            //this.log.consoleLog(element);
            this.loadTimeTable.push(TimeTable.fromJson(element));
          });

          this.log.consoleLog(this.loadTimeTable);
         
        }
          this.dbInProgreess =false;
      }), ((Error) => {
          this.dbInProgreess =false;
          this.log.consoleLog(Error);
      });

    } else {

      this.loadClassSectionDefaultTimeTable();
    }

  }

  /**
   * load the deafult class and section time table
   */
  loadClassSectionDefaultTimeTable() {
    
    let class_id;
    let section_id;
    if (this.classes.length > 0) {
      class_id = this.classes[0].class_id;
      section_id = 1;
      this._selected_class = this.classes[0];
      this.loadClassTimeTable(class_id, section_id);
    }
    else {
      class_id = 1;
      section_id = 1;
      this.loadClassTimeTable(class_id, section_id);
    }
  }
  /**
   * Select Teachers w.r.t skill
   */
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
      // this.onCombineDuplicateRegNameIntoOnBasedOnSkill();
    });
  }

  /**
   * Select Teacher based on perticular subject
   */
  public teacherSKillDataBasedOnPerSkill: any = new Array<TeachersList>();
  onLoadSkillDataBasedOnSelectedSkillData(skillId): Array<TeachersList> {
    let skills = []

    if (skillId > 0) {
      skills = []
      // this.log.consoleLog(skillId)
      this.teachersList.filter((data) => {
        // this.log.consoleLog(data);
        if (data.skillId == skillId) {
          skills.push(data);
        }
      });
      //  this.log.consoleLog(skills);
    }
    else {

      //  skills=[];
      this.log.consoleLog('NO DATA')
      return this.teacherSKillDataBasedOnPerSkill; // return old data.
    }

    return skills;
  }

  //select the user name and registraion id. 
  // asign to refrence. 

  setTeacherName(intRegistrationId: any, array: Array<any>, ref: any, timing: any, day: any) {

    let data: TeachersList;

    array.filter(element => {
      if (element.intRegistrationId == intRegistrationId) {
        data = element;
      }

      this.log.consoleLog(data);

    });

    ref.teacher_name = data.txtFirstName;
    ref.reg_id = data.intRegistrationId;
    ref.section_name = this._selected_section.section_name;
    ref.class_name = this._selected_class.class_name;
    ref.section_id = this._selected_section.section_id;
    ref.class_id = this._selected_class.class_id;
    ref.time_start = parseInt(timing.timings);
    ref.time_end = this.getPeriodEndTime(timing);
    ref.day_name = day.day;

    this.log.consoleLog("Id is " + ref._id);

    if (ref.mode == '' || ref.mode == undefined) {
      ref.mode = TIMETABLE._INSERT;
    }

    let isValid = this.validateSubjectAndSkill(ref, intRegistrationId);

    //this.log.consoleLog(isValid);
    if (!isValid) {
      ref.removeTimeTable();
    } else {

      this.log.consoleLog(ref);
      TIMETABLE.addToTimeTableArray(ref);

    }

  }

  /**
   * 
   * @param start_time 
   * get the period end time based on start time of period
   */

  getPeriodEndTime(start_time: any): any {
    let _local: any;

    if (this.classTimings.length > 0) {

      let index = this.classTimings.indexOf(start_time);
      if (index >= 0 && index < this.classTimings.length) {
        if ((index + 1) < this.classTimings.length) {
          _local = this.classTimings[index + 1].timings;
        }
        else {
          _local = start_time.timings;

        }
      }

    }

    return parseInt(_local);

  }

  // after selecting subject and teacher validate it. 

  validateSubjectAndSkill(ref_table: any, reg_id: any): boolean {

    this.log.consoleLog(ref_table);

    let found = this.onLoadSkillDataBasedOnSelectedSkillData(ref_table.subject_id);
    let isValid = false;
    if (found.length > 0) {
      found.forEach((findUser) => {
        if (findUser.intRegistrationId == ref_table.reg_id) {
          isValid = true;
        }
      });
    }


    // Validate teacher allocated period  ---PENDING

    let params = new URLSearchParams();
    params.set('filter','(day_name = '+ref_table.day_name +') AND (time_start ='+ ref_table.time_start +') AND ('+'reg_id = '+reg_id+')');

   this.dbService.queryMongo('timetable', '', params).subscribe((data) => {
      
      if(data!=null) 
        {
          data =data.json();
          this.log.consoleLog(data);
            if(data.resource.length > 0) {
            isValid=false;
              ref_table.removeTimeTable();
          }
        }

   },(error =>{
     isValid=false;
   }));

    return isValid;

  }



}





