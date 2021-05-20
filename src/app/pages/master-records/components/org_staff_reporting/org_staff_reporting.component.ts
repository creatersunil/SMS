import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {OrgStaffType} from './org_staff';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!./org_staff_reporting.scss';
import {Logs,UserConfig} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
import {GroupView} from './group-view';
import {ReportingList} from './reporting-list'

@Component({
  selector: 'org_staff_reporting',
 styleUrls: ['./modals.scss'],
  templateUrl: './org_staff_reporting.html',
  providers:[DbService,Logs,UserConfig]
})
export class OrgStaffComponent implements OnInit {
   myForm:FormGroup;

  @ViewChild('childModal') childModal: ModalDirective;

  showChildModal(): void 
    {
       this.childModal.show();
     }

  hideChildModal(): void
   {
      this.childModal.hide();
    }


  ngOnInit() {
   //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   //Add 'implements OnInit' to the class.
   this.loadData();
   this.accessViews();
 }

 //Select group view and access
  groups=[];
  loginId:any;
  accessViews(){

     var queryFilters = new URLSearchParams();
                    queryFilters.set('fields','group_name');
                     
                   this.dbService.query('cfg_group_default_views','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((groups) => {
                    this.groups.push(GroupView.fromJson(groups));
                    //this.log.consoleLog(this.classes.length);
                });
                  // this.log.consoleLog(data);
        
          })
          this.loginId=this.userConfig.getRegId();
           (<FormControl>this.myForm.controls['user_id'])
              .setValue(this.loginId, { onlySelf: true });
  }

  reportingto=[];
 onSelectGroup(groupName:any){
   this.log.consoleLog(groupName);
       
     var queryFilters = new URLSearchParams();
                 queryFilters.set('filter','group_name ='+groupName);
                    queryFilters.set('fields','intRegistrationId,txtFirstName');
                     this.reportingto=[];
                   this.dbService.query('mst_registration','',queryFilters).subscribe((result)=>{
            
                  var data: any = result.json();            
                  data.resource.forEach((reportingto) => {
                    this.reportingto.push(ReportingList.fromJson(reportingto));
                    
                });
                 
        
          });
    

 }



 settings = {
   actions:{
     delete:false,
     add:false
   },
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate:true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave:true
    },
   
    columns: {
      reporting_to: {
        title: 'Reporting',
        type: 'string',
        
      },
      comments: {
        title: 'comments',
        type: 'string'
      },
      is_active: {
        title: 'IsActive',
        editor: {
        type: 'checkbox',
        config:{
          true:'true',
          false:'false'
        }
        }
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();


 loadData() {

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','row_id,user_id,comments,reporting_to,is_active,dt_repoting_start,dt_reporting_end');
    
       this.dbService.query('org_staff_reporting','',queryFilters).subscribe((result)=>{
          this.orgs=[];
            var data: any = result.json();            
              data.resource.forEach((orgs) => {
                    this.orgs.push(OrgStaffType.fromJson(orgs));
                    this.log.consoleLog(this.orgs.length);
                });
           this.log.consoleLog(this.orgs);
             this.source.load(this.orgs);
        
          })
        }



idDisabled=false;
  reportingValidation(reportValue){
    this.log.consoleLog(reportValue);
    if(reportValue == this.loginId)
    {
      (<FormControl>this.myForm.controls['reporting_to'])
              .setValue(0, { onlySelf: true });
       this.idDisabled=true;
    }
    else{
      this.log.consoleLog("ok");
      this.idDisabled=false;
    }

  }


  query: string = '';
orgs=[];
  constructor(private formBuilder :FormBuilder,private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {
       this.myForm = formBuilder.group({
                                        'user_id' :[''],
                                        'reporting_to':[''],
                                        'dt_repoting_start':[''],
                                        'dt_reporting_end':[''],
                                        'is_active':[false],
                                        'comments':[''],
                                        'group_name':['']
       })
  }


  onSubmit(){
                  this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
                 this.dbService.insert('org_staff_reporting',this.myForm.getRawValue()).subscribe((data)=>{
                    this.log.consoleLog(data);
                    this.loadData();
                  });
  }




  //Store the smart table event data
event:any;
/**
 * 
 * @param event Get the data from Smart table
 * @param dialog Show the dialog box for confirmation
 */
 onCreateDialog(event,dialog){
   this.event=event;
   this.log.consoleLog(JSON.stringify(event.newData));
   dialog.show();
 }




/**
 * 
 * @param dialog Hide Confirm dialog box and Insert the data to database
 * @param existdialog Show pop up if data already exists in database
 */
onCreateDialogConfirm(dialog,existdialog){
  this.log.consoleLog(JSON.stringify(this.event.newData));
   this.event.confirm.resolve();
      if(!this.validateData(this.event))
      {
       this.log.consoleLog(JSON.stringify(this.event.newData));
       this.dbService.insert('org_staff_reporting',this.event.newData).subscribe((data)=>this.log.consoleLog(data));
       dialog.hide();  
    }
      else{
          dialog.hide();
          existdialog.show();
      }

  
}




/**
 * 
 * @param dialog Update the edited record and hide the dialog box
 * @param existdialog Show pop up if data already exists in database
 */
onEditeDialogConfirm(dialog,existdialog){
    this.event.confirm.resolve()
    if(!this.onEditValidate(this.event))
      {
       this.log.consoleLog(JSON.stringify(this.event.newData));
     var queryFilters = new URLSearchParams();
       queryFilters.set('filter','row_id ='+this.event.newData.row_id);

    this.dbService.update('org_staff_reporting',this.event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
     dialog.hide();  
    }
      else{
        dialog.hide();
        existdialog.show();
      }
  }



 

/**
 * 
 * @param dialog If Confirm data rejected hide the dialog
 */
onCreateDialogReject(dialog){
  this.event.confirm.reject();
  dialog.hide();
}


  onEditConfirm(event): void {
    this.log.consoleLog(event);
    if (window.confirm('Are you sure you want to Update?')) {

      event.confirm.resolve();
       if(!this.onEditValidate(event))
      {
       this.log.consoleLog(JSON.stringify(event.newData));
     var queryFilters = new URLSearchParams();
       queryFilters.set('filter','row_id ='+event.newData.row_id);

    this.dbService.update('org_staff_reporting',event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
      }
 
      //this.log.consoleLog(event);
    } else {
      event.confirm.reject();
    }
  }
  onCreateConfirm(event): void {
  
    if (window.confirm('Are you sure you want to add?')) {
      event.confirm.resolve();
      if(!this.validateData(event))
      {
       this.log.consoleLog(JSON.stringify(event.newData));
       this.dbService.insert('org_staff_reporting',event.newData).subscribe((data)=>this.log.consoleLog(data));
      }
      else{
        this.log.consoleLog('refreshing '+this.source.count());
        this.source.refresh();
      }
      
    } else {
      event.confirm.reject();
    }
  }


validateData(event):Boolean
{
  
  this.log.consoleLog(event.newData.reporting_to.trim().length);
if(event.newData.reporting_to.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.orgs.find((orgs) => {
       this.log.consoleLog(orgs.reporting_to.toUpperCase() === event.newData.reporting_to.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (orgs.reporting_to.toUpperCase().trim() === event.newData.reporting_to.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.reporting_to.trim().length);
if(event.newData.reporting_to.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.orgs.find((orgs) => {
               this.log.consoleLog((orgs.reporting_to.toUpperCase()===event.newData.reporting_to.trim().toUpperCase()) && (orgs.is_active == event.newData.is_active));
                return((orgs.reporting_to.toUpperCase()===event.newData.reporting_to.trim().toUpperCase()) && (orgs.is_active == event.newData.is_active));
                   
                });
               
}
                    

}
}
