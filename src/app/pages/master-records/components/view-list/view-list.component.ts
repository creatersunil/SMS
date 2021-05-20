import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { LocalDataSource } from 'ng2-smart-table';
import {DbService ,UserConfig} from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';

import {ViewList} from './view-list'
@Component({
  selector: 'view-list',
 styleUrls: ['./modals.scss'],
  templateUrl: './view-list.html',
  providers:[DbService,Logs,UserConfig]
})
export class ViewListComponent implements OnInit {

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
      viewName: {
        title: 'View Name',
        type: 'string'
      },
        Active: {
          title: 'IsActive',
          editor: {
          type: 'checkbox',
          config:{
            true:'1',
            false:'0'
          }
          }
        }
    }
  };
  source: LocalDataSource = new LocalDataSource();

query: string = '';
viewlist=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {}


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
             this.source.load(this.viewlist);
        
            }
        ) 
      }


  
onCreateDoc(_viewName,_Active,_created_by){
   var doc={
    viewName:_viewName,
     Active:_Active,
     created_by:_created_by
   }
   return doc;
}
onEditDoc(_viewName,_Active,_edited_by){
   var doc={
    viewName:_viewName,
     Active:_Active,
     edited_by:_edited_by
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
       this.log.consoleLog(JSON.stringify(this.event.newData));
       this.dbService.insert('cfg_view_list',this.onCreateDoc(this.event.newData.viewName,this.event.newData.Active,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
         queryFilters.set('filter','viewId ='+this.event.newData.viewId);

    this.dbService.update('cfg_view_list',this.onEditDoc(this.event.newData.viewName,this.event.newData.Active,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','viewId ='+event.newData.viewId);

    this.dbService.update('cfg_view_list',this.onEditDoc(event.newData.viewName,event.newData.Active,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('cfg_view_list',this.onCreateDoc(event.newData.viewName,event.newData.Active,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.viewName.trim().length);
if(event.newData.viewName.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.viewlist.find((viewlist) => {
       this.log.consoleLog(viewlist.viewName.toUpperCase() === event.newData.viewName.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (viewlist.viewName.toUpperCase().trim() === event.newData.viewName.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.viewName.trim().length);
if(event.newData.viewName.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.viewlist.find((viewlist) => {
               this.log.consoleLog((viewlist.viewName.toUpperCase()===event.newData.viewName.trim().toUpperCase()));
                return((viewlist.viewName.toUpperCase()===event.newData.viewName.trim().toUpperCase()) );
                   
                });
               
}
                    

}
}
