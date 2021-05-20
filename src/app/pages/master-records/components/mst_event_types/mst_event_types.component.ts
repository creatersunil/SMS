import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {MstEventType} from './mst_event_types';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService ,UserConfig} from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!./mst_event_types.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'mst_event_types',
 styleUrls: ['./modals.scss'],
  templateUrl: './mst_event_types.html',
  providers:[DbService,Logs,UserConfig]
})
export class MstEventComponent implements OnInit {
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
      event_name: {
        title: 'EventName',
        type: 'string'
      },
       event_description: {
        title: 'EventDescription',
        type: 'string'
      },
      /**isActive: {
        title: 'IsActive',
        editor: {
        type: 'checkbox',
        config:{
          true:'true',
          false:'false'
        }
        }
      }*/
    }
  };
  source: LocalDataSource = new LocalDataSource();
loginId:any;
date:number;
events=[];
 loadData() {
        this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','event_type,event_name,event_description');
    
       this.dbService.query('mst_event_types','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((events) => {
                    this.events.push(MstEventType.fromJson(events));
                    this.log.consoleLog(this.events.length);
                });
           this.log.consoleLog(this.events);
             this.source.load(this.events);
        
            
    
});
this.dbService.getDateTime('getDate').subscribe((date)=>{
        this.date = date;
        this.log.consoleLog(this.date);
       
    });

}


  query: string = '';
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

  
  onCreateDoc(_event_name,_event_description,_created_by,_created_date){
      var doc={
        event_name:_event_name,
        event_description:_event_description,
        created_by:_created_by,
        created_date:_created_date
      }
      return doc;
  }

   onEditDoc(_event_name,_event_description,_edited_by){
      var doc={
        event_name:_event_name,
        event_description:_event_description,
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
       this.dbService.insert('mst_event_types',this.onCreateDoc(this.event.newData.event_name,this.event.newData.event_description,this.loginId,this.date)).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','event_type ='+this.event.newData.event_type);

      this.dbService.update('mst_event_types',this.onEditDoc(this.event.newData.event_name,this.event.newData.event_description,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      queryFilters.set('filter','event_type ='+event.newData.event_type);

  //     this.dbService.update('mst_event_types',this.onEditDoc(event.newData.event_name,event.newData.event_description,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //     JSON.stringify(event.newData);
  //      this.dbService.insert('mst_event_types',this.onCreateDoc(event.newData.event_name,event.newData.event_description,this.loginId,this.date)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.event_name.trim().length);
if(event.newData.event_name.trim().length<1 || event.newData.event_description.trim().length <1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.events.find((events) => {
      // this.log.consoleLog(leave.event_name.toUpperCase() === event.newData.event_name.trim().toUpperCase());
       //this.log.consoleLog('validateFunction');
                  return (events.event_name.toUpperCase().trim() === event.newData.event_name.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.event_name.trim().length);
if(event.newData.event_name.trim().length<1 || event.newData.event_description.trim().length <1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.events.find((events) => {
               //this.log.consoleLog((leave.event_name.toUpperCase()===event.newData.txtLeaveType.trim().toUpperCase()) && (leave.isActive == event.newData.isActive));
                return((events.event_name.toUpperCase()===event.newData.event_name.trim().toUpperCase()) /*&& (leave.isActive == event.newData.isActive)*/);
                   
                });
               
}
                    

}
}
