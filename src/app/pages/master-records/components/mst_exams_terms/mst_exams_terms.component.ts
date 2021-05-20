import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {MstExamsTems} from './mst_exams_terms';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService,UserConfig } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!./mst_exams_terms.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'mst_exams_terms',
styleUrls: ['./modals.scss'],
  templateUrl: './mst_exams_terms.html',
  providers:[DbService,Logs,UserConfig]
})
export class MstExamsComponent implements OnInit {
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
   this.getDate();
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
      txtTermName : {
        title: 'Exam Name',
        type: 'string'
      },
      intStatus: {
        title: 'IsActive',
        editor: {
        type: 'checkbox',
        config:{
          true:1,
          false:0
        }
        }
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  date:number;
loginId:any;
examterms=[];
 loadData() {
   this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','intTermId,txtTermName,intStatus');
    
       this.dbService.query('mst_exam_terms','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((examterms) => {
                    this.examterms.push(MstExamsTems.fromJson(examterms));
                    this.log.consoleLog(this.examterms.length);
                });
           this.log.consoleLog(this.examterms);
             this.source.load(this.examterms);
        
            
    
}
        ) }


  query: string = '';
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }



getDate()
{
    this.dbService.getDateTime('getDate').subscribe((date)=>{
        this.date = date;
        this.log.consoleLog(this.date)
    });
}

  onCreateDoc(_txtTermName,_created_by,_created_date,_intStatus){
    var doc={
         txtTermName:_txtTermName,
         created_by:_created_by,
         created_date:_created_date,
         intStatus:_intStatus
    }
    return doc;
  }

onEditDoc(_txtTermName,_edited_by,_intStatus){
    var doc={
         txtTermName:_txtTermName,
         edited_by:_edited_by,
         intStatus:_intStatus
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
       this.dbService.insert('mst_exam_terms',this.onCreateDoc(this.event.newData.txtTermName,this.loginId,this.date,this.event.newData.intStatus)).subscribe((data)=>this.log.consoleLog(data));
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
        queryFilters.set('filter','intTermId ='+this.event.newData.intTermId);

    this.dbService.update('mst_exam_terms',this.onEditDoc(this.event.newData.txtTermName,this.loginId,this.event.newData.intStatus),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      queryFilters.set('filter','intTermId ='+event.newData.intTermId);

  //   this.dbService.update('mst_exam_terms',this.onEditDoc(event.newdata.txtTermName,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      this.dbService.insert('mst_exam_terms',this.onCreateDoc(event.newdata.txtTermName,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.txtTermName.trim().length);
if(event.newData.txtTermName.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.examterms.find((examterms) => {
       this.log.consoleLog(examterms.txtTermName.toUpperCase() === event.newData.txtTermName.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (examterms.txtTermName.toUpperCase() === event.newData.txtTermName.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.txtTermName.trim().length);
if(event.newData.txtTermName.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.examterms.find((examterms) => {
               this.log.consoleLog((examterms.txtTermName.toUpperCase()===event.newData.txtTermName.trim().toUpperCase()) && (examterms.intStatus == event.newData.isActive));
                return((examterms.txtTermName.toUpperCase()===event.newData.txtTermName.trim().toUpperCase())  && (examterms.intStatus == event.newData.isActive));
                   
                });
               
}
                    

}
}
