import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { NgUploaderOptions } from 'ngx-uploader';
import * as _ from 'lodash';

// import classes
import { DbService, Logs, UserConfig } from '../../../../services';
import { UtilsService } from '../../../../utils/utils.service';
import { Classes } from '../../../../services';
import { FeesDetails } from '../../../../services';
import { FeeCreation } from '../../../../services';
import { SnotifyService, SnotifyConfig } from 'ng-snotify';


@Component({
  selector: 'nga-app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss'],
  providers: [DbService, Logs, UserConfig, UtilsService],
})

export class FeeComponent implements OnInit, OnDestroy {

  disableEdit = true;
  enableView = false;
  // classes: Array<Classes> = [];
  public classes: any[] = new Array<Classes>();
  public feesDetails: any[] = new Array<FeesDetails>();
  feeCreationDataArray: any[] = new Array();
  insertFeeComponentAmountArray: Array<any> = [];
  updateFeeComponentAmountArray = [];

  loginId: any;
  enabled = 1;
  count = 0;
  active: boolean = true;

  successfullySaved: boolean = true;
  public submitted: boolean = false;
  public loading: boolean = false;

  editMode: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private log: Logs, private userConfig: UserConfig,
    private dbService: DbService, private renderer: Renderer, private utilService: UtilsService, private notify: SnotifyService)
  { }



  ngOnInit() {

    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,

      });

    this.onLoadClasses();
    this.loginId = this.userConfig.getRegId();

    // this.onClassSeclect(1);
  }

  /**
   * To load the  class data
   */
  onLoadClasses() {
    const queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'class_enabled =' + this.enabled);
    queryFilters.set('fields', 'class_id,class_name,class_enabled');
    this.classes = [];
    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      const data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
      });
      this.onLoadFeesDetails();
    });
  }

  /**
   * Load The fee components fro mst_fees_details and load inital data to class 1 as default vaules
   */
  public storedFeeDetails: any[] = new Array<FeesDetails>();
  onLoadFeesDetails() {
    const queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'fee_name,fees_ref_id');
    this.feesDetails = []
    this.dbService.query('mst_fees_details', '', queryFilters).subscribe((result) => {
      const data: any = result.json();
      data.resource.forEach((fees) => {
        this.storedFeeDetails.push(FeesDetails.fromJson(fees));
      });
      this.feesDetails = _.cloneDeep(this.storedFeeDetails);
      this.onClassSeclect(this.classes[0].class_id);
    });

    this.log.consoleLog('storedArr');
    this.log.consoleLog(this.storedFeeDetails);
    this.log.consoleLog('storedArr');
    // this.log.consoleLog(this.storedFeeDetails);
  }





  /**
   * Enable edit mode
   */
  onClickEditBtn() {
    this.editMode = true;
  }



  /**
   * Onclick Cancel Edit Mode
   */
  onClickCancelBtn() {
    this.editMode = false;
    this.addFeeComponent = false;
  }


  /**
   * To enable add new fee Component
   */
  addFeeComponent = false;
  onClickAddFeeComponent() {
    this.addFeeComponent = true;
  }

  /**
   * Cancel Add New Fee Component disable
   */
  onClickCancelAddFeeComponent() {
    this.addFeeComponent = false;
  }

  /// On click cancel addition of fee component removes the component
  onClickRemoveFeeComponent(fee) {
    this.log.consoleLog(fee);
    this.log.consoleLog(fee.fee_collectable_id);
    this.feeCreationDataArray.splice(this.feeCreationDataArray.indexOf(fee), 1);
    if (fee.fee_collectable_id > 0) {
      this.updateFeeComponentAmountArray.splice(this.updateFeeComponentAmountArray.indexOf(fee), 1);
    }
    else {
      this.insertFeeComponentAmountArray.splice(this.insertFeeComponentAmountArray.indexOf(fee), 1);
    }
  }



  classId: any;
  onClassSeclect(_class) {
    this.feesDetails = [];
    // this.feesDetails = this.storedFeeDetails;
    this.feesDetails = Array.from(this.storedFeeDetails);
    this.log.consoleLog(this.feesDetails);
    if (_class < 0) {
      this.log.consoleLog('Nok');
      this.disableEdit = true;
      this.editMode = false;
      this.enableView = false;
    }
    else if (_class > 0) {
      this.disableEdit = false;
      this.enableView = true;;
      this.log.consoleLog(_class);
      this.classId = parseInt(_class);
      this.log.consoleLog(this.classId);
      this.feeCreationdata(_class);

    }

  }

  /**
   * fetch fees details of perticular class from tr_collectable table
   */


  feeCreationdata(classId) {

    const param = {
      'name': 'classId',
      'value': classId,
    };
    this.feeCreationDataArray = [];
    this.dbService.getDataFromProc('mst_fee_creation', param).subscribe((result) => {

      {
        this.log.consoleLog(result.resource.length)
        result.resource.forEach((item) => {
          this.feeCreationDataArray.push(FeeCreation.fromJson(item));
        });



        this.log.consoleLog(this.feeCreationDataArray);

        if (this.insertFeeComponentAmountArray.length > 0) {
          this.insertFeeComponentAmountArray.filter((data) => {
            if (data.class_id == classId) {
              this.feeCreationDataArray.push(FeeCreation.fromJson(data));
            }
            else {
              this.log.consoleLog("raki");
            }
          });

        };
        if (this.updateFeeComponentAmountArray.length > 0) {
          this.updateFeeComponentAmountArray.filter((data) => {
            if (data.class_id == classId) {
              this.feeCreationDataArray = _.unionBy([data], this.feeCreationDataArray, 'fee_collectable_id');
            }
            else {
              // this.filterArray();
              this.log.consoleLog("nulla");
            }
          })
        }
        this.log.consoleLog("praveen");
        this.filterArray();
        this.log.consoleLog("praveen");

      }
    });
  }






  /**
   *  To create new FeeComponent insert fee component to database and push to perticular clsss
   * @param compName 
   * @param monthlyFee 
   * @param yearlyFees 
   */
  onClickCreateComponent(compName, monthlyFee, yearlyFees) {
    this.log.consoleLog(compName);
    this.log.consoleLog(monthlyFee);
    this.log.consoleLog(yearlyFees);
    if (compName.trim().length !== 0) {
      this.count = this.count + 1;
      const queryFilters = new URLSearchParams();
      let refId: any;
      this.dbService.insert('mst_fees_details', this.insertFeeComponentDoc(compName)).subscribe((data) => {
        this.log.consoleLog(data);
        refId = data.resource[0].fees_ref_id;

        this.log.consoleLog(refId);
        this.feeCreationDataArray.push(new FeeCreation(compName, refId, this.classId, yearlyFees, monthlyFee, 0, this.count, this.active));
        this.insertFeeComponentAmountArray.push(
          this.insertArrayDoc(compName, refId, monthlyFee, yearlyFees, this.count, this.active));
      });
      this.log.consoleLog(this.insertFeeComponentAmountArray);
    }
    else {
      this.log.consoleLog("Empty");
    }
  }



  insertArrayDoc(compName, refId, _monthlyFee, _yearlyFees, _insertNumber, _active) {
    const doc = {
      created_by: this.loginId,
      fee_name: compName,
      fees_ref_id: refId,
      monthlyFee: _monthlyFee,
      yearlyFees: _yearlyFees,
      class_id: this.classId,
      insertNumber: _insertNumber,
      is_active: _active
    };
    return doc;
  }

  updateArrayDoc(compName, refId, _monthlyFee, _yearlyFees, feeCollectableId, _active) {
    const doc = {
      created_by: this.loginId,
      fee_name: compName,
      fees_ref_id: refId,
      monthlyFee: _monthlyFee,
      yearlyFees: _yearlyFees,
      class_id: this.classId,
      fee_collectable_id: feeCollectableId,
      is_active: _active
    };
    return doc;
  }


  /**
   * Insert new Created Fee Component Doc
   */
  insertFeeComponentDoc(_feeNname) {
    const doc = {
      fee_name: _feeNname,
      created_by: this.loginId,
    };
    return doc;
  }


  // feeRefId, feeName, monthlyFee, yearlyFees, feeCollectableId
  // uniqueUpdateArrayAmounts = [];
  // uniqueInsertArrayAmounts = [];
  onCreateFeeAmounts(feedata) {

    this.log.consoleLog(feedata.fee_collectable_id);




    if (feedata.fee_collectable_id > 0) {

      // this.uniqueUpdateArrayAmounts.push(this.updateArrayDoc(feedata.fee_name, feedata.fees_ref_id, feedata.monthlyFee, feedata.yearlyFees, feedata.fee_collectable_id, feedata.is_active));
      this.updateFeeComponentAmountArray.push(this.updateArrayDoc(feedata.fee_name, feedata.fees_ref_id, feedata.monthlyFee, feedata.yearlyFees, feedata.fee_collectable_id, feedata.is_active));

      this.updateFeeComponentAmountArray = this.utilService.removeDulpicates(this.updateFeeComponentAmountArray, 'fee_collectable_id');

      this.log.consoleLog('update data');
      this.log.consoleLog(this.updateFeeComponentAmountArray);
      this.log.consoleLog('update data');
    }
    else {
      this.log.consoleLog(feedata.fee_collectable_id);
      this.log.consoleLog(feedata.is_active);
      if (feedata.is_active == true) {
        this.log.consoleLog('ok');
        // this.uniqueInsertArrayAmounts.push(this.insertArrayDoc(feedata.fee_name, feedata.fees_ref_id, feedata.monthlyFee, feedata.yearlyFees, feedata.insertNumber, feedata.is_active));
        this.insertFeeComponentAmountArray.push(this.insertArrayDoc(feedata.fee_name, feedata.fees_ref_id, feedata.monthlyFee, feedata.yearlyFees, feedata.insertNumber, feedata.is_active));
        this.insertFeeComponentAmountArray = this.utilService.removeDulpicates(this.insertFeeComponentAmountArray, 'insertNumber');
      }
      else {
        this.log.consoleLog('remove');
        this.feeCreationDataArray.splice(this.feeCreationDataArray.indexOf(feedata), 1);
        this.insertFeeComponentAmountArray.splice(this.insertFeeComponentAmountArray.indexOf(feedata), 1);
      }

      // this.insertFeeComponentAmountArray.push(feedata);
      // this.insertFeeComponentAmountArray.filter((data) => {
      //   if (data.insertNumber == feedata.insertNumber) {
      //     this.insertFeeComponentAmountArray = _.unionBy([data], this.insertFeeComponentAmountArray, 'insertNumber');
      //   }

      // });
      this.log.consoleLog('insert data');
      this.log.consoleLog(this.insertFeeComponentAmountArray);
      this.log.consoleLog('insert data');
    }

  }

  /** 
   * filter components which are not present for perticular class
   */
  filterArray() {
    this.log.consoleLog(this.storedFeeDetails);
    this.log.consoleLog(this.feesDetails);
    this.log.consoleLog(this.feeCreationDataArray);
    for (var i = this.feesDetails.length - 1; i >= 0; i--) {
      for (var j = 0; j < this.feeCreationDataArray.length; j++) {
        if (this.feesDetails[i] && (this.feesDetails[i].fees_ref_id === this.feeCreationDataArray[j].fees_ref_id)) {
          this.feesDetails.splice(i, 1);
        }
      }
    }

  }






  /**
   *  Add Existing Components to components
   * @param monthlyFee 
   * @param yearlyFees
   */
  onAddExistingDataToComponent(monthlyFee, yearlyFees) {

    this.count = this.count + 1;
    this.log.consoleLog(monthlyFee);
    this.log.consoleLog(this.feeCreationDataArray.length);
    if (this.selectedComponentId > 0) {
      this.feeCreationDataArray.push(new FeeCreation(this.selectedComponent, this.selectedComponentId,
        this.classId, yearlyFees, monthlyFee, 0, this.count, this.active));

      this.log.consoleLog(this.feeCreationDataArray);




      this.insertFeeComponentAmountArray.push(
        this.insertArrayDoc(this.selectedComponent, this.selectedComponentId, monthlyFee, yearlyFees, this.count, this.active));
      this.log.consoleLog('insert data');
      this.filterArray();
      this.log.consoleLog(this.insertFeeComponentAmountArray);
      this.log.consoleLog('insert data');
      this.selectedComponent = null;
      this.selectedComponentId = null;
      monthlyFee = null;
      yearlyFees = null;
    }
    else {
      this.log.consoleLog('select the component');
    }
  }




  /**
   * To select the name and id of the dropdown selected value
   */
  selectedComponent: any;
  selectedComponentId: any;
  onSelectDropdown(event) {
    this.selectedComponentId = parseInt(event);
    this.log.consoleLog(event);
    this.feesDetails.filter((data) => {
      if (data.fees_ref_id == event) {
        this.selectedComponent = data.fee_name;
      }
    });
  }




  /**
   * Save the data to database
   */
  onClickSaveBtn() {

    this.editMode = false;
    this.addFeeComponent = false;
    // this.submitted = true;
    // this.loading = true;
    // let successUpdateData: number;
    if (this.updateFeeComponentAmountArray.length > 0) {
      this.dbService.update('tr_fee_collectable', this.updateFeeComponentAmountArray, '').subscribe((data) => {
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Updated");
        }

      }, (error) => { this.notify.info("Error", "Somthing went wrong!!"); });

    }

    if (this.insertFeeComponentAmountArray.length > 0) {
      this.dbService.insert('tr_fee_collectable', this.insertFeeComponentAmountArray).subscribe((data) => {

        this.log.consoleLog(data);

        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Added");
        }

      }, (error) => { this.notify.info("Error", "Somthing went wrong!!"); });
    }

    // this.log.consoleLog(this.storedFeeDetails);
    // this.feesDetails = this.storedFeeDetails;
    // this.log.consoleLog(this.feesDetails);
    // this.onLoadClasses();

    this.onLoadClasses();
    this.onClassSeclect(1);

    this.cleanComponent();
    this.editMode = false;
    this.addFeeComponent = false;
    this.disableEdit = true;
  }



  /**
   * To Edit the name of component 
   * @param fee changed feename
   */
  onEditFeeComponentName(fee) {
    this.log.consoleLog(fee.fee_name);
    this.log.consoleLog(fee.fees_ref_id);

    const queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'fees_ref_id =' + fee.fees_ref_id);

    this.dbService.update('mst_fees_details', { fee_name: fee.fee_name }, queryFilters).subscribe((data) => {

      this.log.consoleLog(data);
      if (data.resource[0].fees_ref_id > 0) {
        this.onLoadFeesDetails();
      }
    });
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.cleanComponent();
  }

  cleanComponent() {
    this.feesDetails = [];
    this.feeCreationDataArray = [];
    this.insertFeeComponentAmountArray = [];
    this.updateFeeComponentAmountArray = [];
  }

}
