import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { LocalDataSource } from 'ng2-smart-table';
import {DbService,UserConfig } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';

import {ViewList} from './view-list';
import {GroupView} from './group-view';
@Component({
  selector: 'group-view',
 styleUrls: ['./modals.scss'],
  templateUrl: './group-views.html',
  providers:[DbService,Logs,UserConfig]
})
export class GroupViewComponent implements OnInit {
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
   this.loadGroups();
 }
   settings = {
     actions:{
       delete:false
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
         group_name: {
           title: 'Group',
           type: 'string'
         },
         view_name: {
           title: 'Default View',
           type: 'string'
         },
          //  Active: {
          //    title: 'IsActive',
          //    editor: {
          //    type: 'checkbox',
          //    config:{
          //      true:'1',
          //      false:'0'
          //    }
          //    }
          //  }
       }
     };
  source: LocalDataSource = new LocalDataSource();

query: string = '';
viewlist=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

loginId:any;
 loadData() {
        this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','viewId,viewName,Active');
    
       this.dbService.query('cfg_view_list','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((viewlist) => {
                    this.viewlist.push(ViewList.fromJson(viewlist));
                    this.log.consoleLog(this.viewlist.length);
                });
           this.log.consoleLog(this.viewlist);
             //this.source.load(this.viewlist);
        
            
    
        })
  }



grouplist=[];
selectedViewName:any;
  loadGroups(){
    //this.selectedViewName=viewname;
      var queryFilters = new URLSearchParams();
     // queryFilters.set('filter','view_name ='+viewname)
        queryFilters.set('fields','id,group_name,view_name');
             this.grouplist=[];
       this.dbService.query('cfg_group_default_views','',queryFilters).subscribe((result)=>{
            this.grouplist=[];
            var data: any = result.json();            
              data.resource.forEach((grouplist) => {
                    this.grouplist.push(GroupView.fromJson(grouplist));
                    this.log.consoleLog(this.grouplist.length);
                });
           this.log.consoleLog(this.grouplist);
             this.source.load(this.grouplist);
        
            
    
        })
  }


  onCreateDoc(_group_name,_view_name,_created_by){
     var doc={
       group_name:_group_name,
       view_name:_view_name,
       created_by:_created_by
     }
     return doc;
  }

  onEditDoc(_group_name,_edited_by,_view_name){
     var doc={
       group_name:_group_name,
       edited_by:_edited_by,
       view_name:_view_name
     }
     return doc;
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
       this.log.consoleLog(this.onCreateDoc(this.event.newData.group_name,this.selectedViewName,this.loginId));
       this.dbService.insert('cfg_group_default_views',this.onCreateDoc(this.event.newData.group_name,this.event.newData.view_name,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','id ='+this.event.newData.id);
      this.log.consoleLog(this.onEditDoc(this.event.newData.group_name,this.loginId,this.event.newData.view_name));
       this.dbService.update('cfg_group_default_views',this.onEditDoc(this.event.newData.group_name,this.loginId,this.event.newData.view_name),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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


  

  // onEditConfirm(event): void {
  //   this.log.consoleLog(event);
  //   if (window.confirm('Are you sure you want to Update?')) {

  //     event.confirm.resolve();
  //      if(!this.onEditValidate(event))
  //     {
  //      this.log.consoleLog(JSON.stringify(event.newData));
  //    var queryFilters = new URLSearchParams();
  //      queryFilters.set('filter','id ='+event.newData.id);
  //     this.log.consoleLog(this.onEditDoc(event.newData.group_name,this.loginId));
  //      this.dbService.update('cfg_group_default_views',this.onEditDoc(event.newData.group_name,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
  //     }
 
  //     //this.log.consoleLog(event);
  //   } else {
  //     event.confirm.reject();
  //   }
  // }
  // onCreateConfirm(event): void {
  
  //   if (window.confirm('Are you sure you want to add?')) {
  //     event.confirm.resolve();
  //     if(!this.validateData(event))
  //     {
  //      this.log.consoleLog(JSON.stringify(event.newData));
  //      this.log.consoleLog(this.onCreateDoc(event.newData.group_name,this.selectedViewName,this.loginId));
  //      this.dbService.insert('cfg_group_default_views',this.onCreateDoc(event.newData.group_name,this.selectedViewName,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
  //     }
  //     else{
  //       this.log.consoleLog('refreshing '+this.source.count());
  //       this.source.refresh();
  //     }
      
  //   } else {
  //     event.confirm.reject();
  //   }
  // }


validateData(event):Boolean
{
  
  this.log.consoleLog(event.newData.group_name.trim().length);
if(event.newData.group_name.trim().length<1 || event.newData.view_name.trim().length <1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.grouplist.find((grouplist) => {
       this.log.consoleLog(grouplist.group_name.toUpperCase() === event.newData.group_name.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (grouplist.group_name.toUpperCase().trim() === event.newData.group_name.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.group_name.trim().length);
if(event.newData.group_name.trim().length<1 || event.newData.view_name.trim().length<1 ){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.grouplist.find((grouplist) => {
               this.log.consoleLog((grouplist.group_name.toUpperCase() === event.newData.group_name.trim().toUpperCase())  && grouplist.view_name.toUpperCase() == event.newData.view_name.toUpperCase());
                return((grouplist.group_name.toUpperCase() === event.newData.group_name.trim().toUpperCase()) && grouplist.view_name.toUpperCase() == event.newData.view_name.toUpperCase() );
                   
                });
               
}
                    

}
}
