import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { SnotifyService, SnotifyPosition, SnotifyModule, SnotifyToast } from 'ng-snotify';

// classes and services
import { Logs, UserConfig, MessageService, DbService } from '../../../services';
import { GroupView } from './group-view';
import { ViewList } from './view-list';
import { ApplicationViews } from './mongo-application-views';

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
  providers: [DbService, Logs, UserConfig, MessageService]
})
export class UserSetupComponent implements OnInit {
  public frm_create_group: FormGroup;
  public select: number = 1;
  public loginId: number;
  private disable: number = 0;
  public enable: number = 1;
  //Group Data
  public grouplist: any[] = new Array();
  public viewList: any[] = new Array();
  public enableCreateNewGroup: boolean = false;
  public group_name = new String();
  public group_description = new String();
  public defaultViewName = new String();

  //Mapping
  public applicationViews: any[] = new Array<ApplicationViews>();


  public position = SnotifyPosition.right_bottom;
  public sNotifyID = 0;

  constructor(private formBuilder: FormBuilder, private notify: SnotifyService, private dbService: DbService, private router: Router, private log: Logs, private userConfig: UserConfig) {

  }


  ngOnInit() {
    this.notify.setConfig({
      timeout: 3000,
      showProgressBar: false
    }, {
        newOnTop: true,
      });

    this.loadGroups();
    this.loginId = this.userConfig.getRegId();
    this.onLoadApplicationViewsMongo();
  }

  onClickSelectTab(tabNumber) {
    this.select = tabNumber;
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



  loadGroups() {

    this.grouplist = [];
    this.dbService.query('cfg_group_default_views', '').subscribe((result) => {
      this.grouplist = [];
      var data: any = result.json();
      data.resource.forEach((grouplist) => {
        this.grouplist.push(GroupView.fromJson(grouplist));
      });
      this.log.consoleLog(this.grouplist);
    })

    this.viewList = [];
    this.dbService.query('cfg_view_list', '').subscribe((result) => {
      this.viewList = [];
      var data: any = result.json();
      data.resource.forEach((view) => {
        this.viewList.push(ViewList.fromJson(view));
      });
      this.log.consoleLog(this.viewList);
    })
  }


  onClickNewGroup() {
    this.enableCreateNewGroup = true;
  }

  // groupFormData() {
  //   this.frm_create_group = this.formBuilder.group({
  //     group_name: [''],
  //     description: ['']
  //   })
  // }
  deactivationGroupArray: any;
  deactivategropname: any = new String();
  onClickComponent(data) {
    this.deactivategropname = data.group_name;
    this.deactivationGroupArray = this.deactivationGroupArrayDoc(data.id);
    this.log.consoleLog(this.deactivationGroupArray);
  }

  deactivationGroupArrayDoc(_row_id, ) {
    var doc = {
      id: _row_id,
      status: this.disable
    }
    return doc;
  }

  onClickDectivate() {

    if (this.sNotifyID > 0) {
      this.notify.remove(this.sNotifyID);
    }
    this.position = SnotifyPosition.center_center;
    this.setGlobal();
    if (this.deactivategropname.length > 0) {
      this.sNotifyID = this.notify.confirm(this.deactivategropname, 'Will be disabled', {
        timeout: 0,
        closeOnClick: true,
        pauseOnHover: true,
        buttons: [
          {
            text: 'Yes', action: () => {

              this.dbService.update('cfg_group_default_views', this.deactivationGroupArray, '').subscribe((data) => {
                if (data.resource.length > 0) {
                  this.notify.info("Success", data.resource.length + " Records Updated");
                  this.log.consoleLog(data);
                  this.grouplist.filter((gdata) => {
                    if (gdata.id == data.resource[0].id) {
                      this.log.consoleLog(gdata);
                      gdata.status = this.disable;
                    }
                  });
                  this.log.consoleLog(this.grouplist);
                }
              }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
              this.notify.remove(this.sNotifyID);
            }, bold: false
          },
          { text: 'No', action: () => { console.log('Clicked: No'); this.notify.remove(this.sNotifyID); }, bold: true },
        ]
      });
    }
    else {
      this.notify.error('Erroe', 'No Data To Disable');
    }

  }


  onSelectViewName(eventname) {
    this.position = SnotifyPosition.right_bottom;
    this.setGlobal();
    this.defaultViewName = eventname;
    if (eventname == '-1') {
      this.defaultViewName = '';
      this.notify.error("Error", "Select Proper Name");
    }
    else {
      this.defaultViewName = eventname;
    }
    this.log.consoleLog(this.defaultViewName);
  }

  onClickSaveNewGroup() {
    this.enableCreateNewGroup = false;
    this.log.consoleLog("Save");
    this.position = SnotifyPosition.right_bottom;
    this.setGlobal();
    if (this.group_name.trim().length > 0 && this.defaultViewName.trim().length > 0) {
      // this.log.consoleLog('No data');
      this.log.consoleLog(this.group_insert_Doc());
      this.dbService.insert('cfg_group_default_views', this.group_insert_Doc()).subscribe((data) => {
        this.log.consoleLog(data);
        if (data.resource.length > 0) {
          this.notify.info("Success", data.resource.length + " Records Inserted");
        }
      }, (error) => { this.notify.error("Error", "Somthing went wrong!!"); });
    }
    else {
      this.log.consoleLog("No data to insert");
      this.notify.error("Error", "Group Name or ViewName is Empty");
    }
  }


  group_insert_Doc() {
    var doc = {
      group_name: this.group_name,
      description: this.group_description,
      status: this.enable,
      created_by: this.loginId,
      view_name: this.defaultViewName
    }
    return doc;
  }

  onClickCancelNewGroup() {
    this.log.consoleLog("Cancel");
    this.enableCreateNewGroup = false;
  }

  ///Module 
  public enableCreateNewModule: boolean = false;
  onClickNewModule() {
    this.enableCreateNewModule = true;
  }

  onClickSaveNewModule() {
    this.log.consoleLog("Save");
    this.enableCreateNewModule = false;
  }

  onClickCancelNewModule() {
    this.log.consoleLog("Cancel");
    this.enableCreateNewModule = false;
  }

  //Mapping
  public enableMappig: boolean = false;
  onClickEditNewMapping() {
    this.enableMappig = true;
  }

  onClickSaveMapping() {
    this.enableMappig = false;
  }

  onClickCancelMapping() {
    this.enableMappig = false;
  }

  accessData = [
    {
      componentName: 'Fee',
      componentDetails: [
        { content: 'View', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Edit', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Approve', parent: true, admin: false, principal: true, teachers: false, students: true },
      ]
    },
    {
      componentName: 'Registration',
      componentDetails: [
        { content: 'View', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Edit', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Approve', parent: true, admin: false, principal: true, teachers: false, students: true },
      ]
    },
    {
      componentName: 'Result',
      componentDetails: [
        { content: 'View', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Edit', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Approve', parent: true, admin: false, principal: true, teachers: false, students: true },
      ]
    },
    {
      componentName: 'Leave',
      componentDetails: [
        { content: 'View', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Edit', parent: true, admin: false, principal: true, teachers: false, students: true },
        { content: 'Approve', parent: true, admin: false, principal: true, teachers: false, students: true },
      ]
    },
  ]

  // mongoApplicationViews:any=new Array<ApplicationViews>();
  onLoadApplicationViewsMongo() {
    this.log.consoleLog(this.accessData)
    var queryHeaders = new URLSearchParams;
    this.dbService.queryMongo('application_views', '', queryHeaders).subscribe((data) => {
      this.applicationViews = [];
      var data: any = data.json();
      data.resource.forEach((view) => {
        this.applicationViews.push(ApplicationViews.fromJson(view));
      });
      this.log.consoleLog(this.applicationViews);
      this.log.consoleLog(this.applicationViews[0].view_actions)
    });
  }


  onChangeView(checkEvent, item, groupdata, actionView) {
    // this.log.consoleLog(checkEvent.target);
    if (checkEvent.target.checked) {
      this.log.consoleLog("Checked");
      this.log.consoleLog(item);
      this.log.consoleLog(groupdata);
      this.log.consoleLog(actionView.value);
    }
    else {
      this.log.consoleLog('Unchecked');
      this.log.consoleLog(item);
      this.log.consoleLog(groupdata);
      this.log.consoleLog(actionView.value)
    }
  }

  userAction = [
    { u_action: 'Edit' },
    { u_action: 'Delete' },
    { u_action: 'View' },
    { u_action: 'Update' },
    { u_action: 'Query' },
    { u_action: 'Search' },
    { u_action: 'ViewOnlyMine' }
  ]



}
