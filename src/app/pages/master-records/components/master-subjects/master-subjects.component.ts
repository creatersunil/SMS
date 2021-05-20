import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Subjects} from './master-subjects';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService ,UserConfig} from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'subjects',
 styleUrls: ['./modals.scss'],
  templateUrl: './master-subjects.html',
  providers:[DbService,Logs,UserConfig]
})
export class MasterSubjectsComponent implements OnInit {
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
      subject_name: {
        title: 'Subject Name',
        type: 'string'
      },
      sub_code:{
        title :'Subject Code',
        type:'string'
      }
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
 loadData() {
        this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','subject_id,subject_name,sub_code');
    
       this.dbService.query('mst_subjects','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((subjects) => {
                    this.subjects.push(Subjects.fromJson(subjects));
                    this.log.consoleLog(this.subjects.length);
                });
           this.log.consoleLog(this.subjects);
             this.source.load(this.subjects);
        
            
    
}
        ) }


  query: string = '';
subjects=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

  onCreateDoc(_subject_name,_sub_code,_created_by){
 var doc={
      subject_name:_subject_name,
      sub_code:_sub_code,
      created_by:_created_by

     }
      return doc;
  }

onEditDoc(_subject_name,_sub_code,_edited_by){
 var doc={
      subject_name:_subject_name,
      sub_code:_sub_code,
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
       this.dbService.insert('mst_subjects',this.onCreateDoc(this.event.newData.subject_name,this.event.newData.sub_code,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','subject_id ='+this.event.newData.subject_id);

    this.dbService.update('mst_subjects',this.onEditDoc(this.event.newData.subject_name,this.event.newData.sub_code,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','subject_id ='+event.newData.subject_id);

    this.dbService.update('mst_subjects',this.onEditDoc(event.newData.subject_name,event.newData.sub_code,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('mst_subjects',this.onCreateDoc(event.newData.subject_name,event.newData.sub_code,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.subject_name.trim().length);
if(event.newData.subject_name.trim().length<1 || event.newData.sub_code.trim().length <1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.subjects.find((subject) => {
       this.log.consoleLog((subject.subject_name.toUpperCase() === event.newData.subject_name.trim().toUpperCase()) || (subject.sub_code == event.newData.sub_code));
       this.log.consoleLog('validateFunction');
                  return ((subject.subject_name.toUpperCase().trim() === event.newData.subject_name.trim().toUpperCase()) || (subject.sub_code == event.newData.sub_code)); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.subject_name.trim().length);
if(event.newData.subject_name.trim().length<1 || event.newData.sub_code.trim().length <1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.subjects.find((subject) => {
               this.log.consoleLog((subject.subject_name.toUpperCase()===event.newData.subject_name.trim().toUpperCase()) && (subject.sub_code === event.newData.sub_code));
                return((subject.subject_name.toUpperCase()===event.newData.subject_name.trim().toUpperCase()) && (subject.sub_code === event.newData.sub_code));
                   
                });
               
}
                    

}
}
