import { Injectable } from '@angular/core';
import { Logs, UserConfig, MessageService, DbService } from '../services';
@Injectable()
export class UtilsService {

  public date: any;
  public primaryColor = '#5594c8'
  public userLoginId: number;

  constructor(private dbService: DbService, private log: Logs, private userConfig: UserConfig) {
    this.dbService.getDateTime('getDate').subscribe((date) => {
      this.date = date;
    });
    this.userLoginId = this.userConfig.getRegId();
  }

  removeDulpicates(originalArray, prop) {
    let newArray = [];
    let lookupObject = {};

    for (var i in originalArray) {
      lookupObject[originalArray[i][prop]] = originalArray[i]
    }
    for (i in lookupObject) {
      newArray.push(lookupObject[i]);
    }
    return newArray;
  }

  // Navigation items
  public select: number = 1;

  //  Database names
  // Mongo DB
  public applicationViewsTable = 'application_views';
  public marksTable = 'marks';
  public attendanceTable = 'attendence';

  getNameValueDropDown(fcnarray: any[], id, match_id): any {
    this.log.consoleLog(fcnarray);
    this.log.consoleLog(id);
    this.log.consoleLog(match_id);
    var newArray = [];
    fcnarray.filter((data) => {
      if (data.match_id == id) {
        newArray = data;
      }
    })
    return newArray;

  }


  //Attendance teacher and student
  public Student: string = "student";
  public Staff: string = "staff";
  public attendancePrStatus = "Present";
  public attendanceAbStatus = "Absent";
  public attendanceLeaveStatus = "On Leave";


  ///MARKS GRADING DATA
  public marksPassStatus: string = "Pass";
  public marksFailStatus: string = "Fail";
  public firstClassWithDistinction: number = 420;
  public firstClass: number = 360;
  public sectondClass: number = 300;
  public passMarks:number=210;
  ///REgistration And list
  belongToBPL = [
    { value: '1', viewValue: 'Yes' },
    { value: '0', viewValue: 'No' }
  ]
  Disabled = [
    { value: '1', viewValue: 'Yes' },
    { value: '0', viewValue: 'No' }
  ]
  genders = [
    { value: '1', viewValue: 'male' },
    { value: '0', viewValue: 'female' }
  ];
  mediumOfInstruction = [
    { value: '1', viewValue: 'Kannada' },
    { value: '2', viewValue: 'English' }
  ];
}
