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
import { FeeCreation } from '../../../services';

import { ChartsModule, Color } from 'ng2-charts';

@Component({
  selector: 'app-student-fee-payment',
  templateUrl: './student-fee-payment.component.html',
  styleUrls: ['./student-fee-payment.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService, UtilsService],
})
export class StudentFeePaymentComponent implements OnInit {

  public select: number = 1;
  public enableCollectFee: boolean = false;
  _COLLECT_FEE = 1;
  _FEE_OVERVIEW = 2;

  public classes: any[] = new Array<Classes>();
  public sections: any[] = new Array<Sections>();
  public sectionNames: any[] = new Array<Sections>();
  feedetailsOfselectedStClass: any[] = new Array();

  public selectedClass: string;
  public selectedClassId: number;
  public selectedsection: string;
  public selectedSectionId: number;


  constructor(private formBuilder: FormBuilder, private utilService: UtilsService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) { }

  ngOnInit() {
    this.onLoadData();
    // this.loadFeeDetailsOfSelectedStudentClass(1);
  }

  onClickLoadTab(tabnumber) {
    this.select = tabnumber;
  }


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
      this.onSelectSectionWRTClass(_class);
      this.loadFeeDetailsOfSelectedStudentClass(_class);
    }
    else {
      this.selectedClass = "";
      this.selectedsection = "";
      // this.onLoadStudentsRecentlyRegistered();
    }
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
    }
  }


  feedata: any = [
    { name: 'Praveen', _class: 'LKG', class_id: 1, sec: 'A', admissionno: 123, total: 'Rs ' + 50000.00, unpaid: 15000 },
    { name: 'Rakesh', _class: 'UKG', class_id: 2, sec: 'A', admissionno: 125, total: 'Rs ' + 50000.00, unpaid: 15000 },
    { name: 'Mohan', _class: 'I', class_id: 3, sec: 'A', admissionno: 126, total: 'Rs ' + 50000.00, unpaid: 15000 },
    { name: 'Madhu', _class: 'II', class_id: 4, sec: 'A', admissionno: 127, total: 'Rs ' + 50000.00, unpaid: 15000 },
  ]


  /**
   * pay fees for student clicked based on class id and section id
   */
  public selectedStudentName: string;
  public selectedStudentClass: string;
  public selectedStudentSection: string;
  payFeeForSelectedStudent(item) {
    this.enableCollectFee = true;
    this.log.consoleLog(item);
    this.selectedStudentName = item.name;
    this.selectedStudentClass = item._class;
    this.selectedStudentSection = item.sec;
    if (this.selectedClassId == item.class_id) {
      this.log.consoleLog('OK');
      this.log.consoleLog(this.feedetailsOfselectedStClass);
    }
    else {
      this.loadFeeDetailsOfSelectedStudentClass(item.class_id);
      this.log.consoleLog("Nok");
    }

  }

  /**
   * load the fees details of perticular class of selected student
   * @param classId Selected student classid
   */
  loadFeeDetailsOfSelectedStudentClass(classId) {
    const param = {
      'name': 'classId',
      'value': classId,
    };
    this.feedetailsOfselectedStClass = [];
    this.dbService.getDataFromProc('mst_fee_creation', param).subscribe((result) => {
      {
        result.resource.forEach((item) => {
          this.feedetailsOfselectedStClass.push(FeeCreation.fromJson(item));
        });
      }
      this.log.consoleLog(result.resource.length);
      this.totalFeeAmtCalculation();
    });
  }

  totalfeeAmount: number;
  totalFeeAmtCalculation() {
    this.totalfeeAmount = 0;
    this.feedetailsOfselectedStClass.filter((data) => {
      this.totalfeeAmount = this.totalfeeAmount + (parseInt(data.yearlyFees) + (parseInt(data.monthlyFee) * (12)));
    })
    this.log.consoleLog(this.totalfeeAmount);
  }
  onClickBackToView() {
    this.enableCollectFee = false;
  }
}
