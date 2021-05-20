import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Week} from './master-week';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService, UserConfig } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'week',
  styleUrls: ['./modals.scss'],
  templateUrl: './master-week.html',
  providers:[DbService,Logs,UserConfig]
})
export class MasterWeekComponent implements OnInit {
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
      day: {
        title: 'Day',
        type: 'string'
      },
      // isActive: {
      //   title: 'IsActive',
      //   editor: {
      //   type: 'checkbox',
      //   config:{
      //     true:'true',
      //     false:'false'
      //   }
      //   }
      // }
    }
  };
  source: LocalDataSource = new LocalDataSource();

loginId:any;
date:number;
 loadData() {
        this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','row_id,day');
    
       this.dbService.query('mst_week','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((week) => {
                    this.week.push(Week.fromJson(week));
                    this.log.consoleLog(this.week.length);
                });
           this.log.consoleLog(this.week);
             this.source.load(this.week);
        
            
    
})
this.dbService.getDateTime('getDate').subscribe((date)=>{
        this.date = date;
        this.log.consoleLog(this.date);
       
    }); }


  query: string = '';
week=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

  
   onCreateDoc(_day,_created_date,_created_by){
    var doc={
      day:_day,
      created_date:_created_date,
      created_by:_created_by
    }
    return doc;
  }

  onEditDoc(_day,_edited_by){
    var doc={
      day:_day,
   
      edited_by:_edited_by
    }
    return
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
       this.dbService.insert('mst_week',this.onCreateDoc(this.event.newData.day,this.date,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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

    this.dbService.update('mst_week',this.onEditDoc(this.event.newData.day,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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

    this.dbService.update('mst_week',this.onEditDoc(event.newData.day,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('mst_week',this.onCreateDoc(event.newData.day,this.date,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.day.trim().length);
if(event.newData.day.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.week.find((week) => {
       this.log.consoleLog(week.day.toUpperCase() === event.newData.day.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (week.day.toUpperCase().trim() === event.newData.day.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.day.trim().length);
if(event.newData.day.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.week.find((week) => {
               this.log.consoleLog((week.day.toUpperCase()===event.newData.day.trim().toUpperCase()) );
                return((week.day.toUpperCase()===event.newData.day.trim().toUpperCase()) );
                   
                });
               
}
                    

}
}
