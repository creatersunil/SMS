import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {FeesDetails} from './master-fees-details';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService ,UserConfig } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'fees-details',
 styleUrls: ['./modals.scss'],
  templateUrl: './master-fees-details.html',
  providers:[DbService,Logs,UserConfig]
})
export class MasterFeesDetailsComponent implements OnInit {
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
   this.getDate();
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
      fee_type:{
       title:'Fee type',
       type:'string'
      },
      fee_name: {
        title: 'fee_name',
        type: 'string'
      },
    }
  };
  source: LocalDataSource = new LocalDataSource();
  date:any;

  
  getDate()
{
    this.dbService.getDateTime('getDate').subscribe((date)=>{
        this.date = date;
        this.log.consoleLog(this.date)
    });
}

loginId:any;
 loadData() {
        this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','row_id,fee_type,fee_name,created_date');
    
       this.dbService.query('mst_fees_types','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((feesDetails) => {
                    this.feesDetails.push(FeesDetails.fromJson(feesDetails));
                    this.log.consoleLog(this.feesDetails.length);
                });
           this.log.consoleLog(this.feesDetails);
             this.source.load(this.feesDetails);
})
}



  query: string = '';
feesDetails=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

  
   onCreateDoc(_fee_type,_fee_name,_created_by,_created_date){
    var doc={
      fee_type:_fee_type,
      fee_name:_fee_name,
      created_by:_created_by,
      created_date:_created_date
    }
    return doc;
  }

  onEditDoc(_fee_type,_fee_name,_edited_by){
    var doc={
      fee_type:_fee_type,
      fee_name:_fee_name,
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
       this.dbService.insert('mst_fees_types',this.onCreateDoc(this.event.newData.fee_type,this.event.newData.fee_name,this.loginId,this.date)).subscribe((data)=>this.log.consoleLog(data));
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

    this.dbService.update('mst_fees_types',this.onEditDoc(this.event.newData.fee_type,this.event.newData.fee_name,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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

    this.dbService.update('mst_fees_types',this.onEditDoc(event.newData.fee_type,event.newData.fee_name,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('mst_fees_types',this.onCreateDoc(event.newData.fee_type,event.newData.fee_name,this.loginId,this.date)).subscribe((data)=>this.log.consoleLog(data));
      }
      else{
        this.log.consoleLog('refreshing '+this.source.count());
        this.source.refresh();
      }
      
    } else {
      event.confirm.reject();
    }
  }

feetypenum:number
validateData(event):Boolean
{
  // this.feetypenum=parseInt(event.newData.fee_type)
  // this.log.consoleLog(this.feetypenum);
  // this.log.consoleLog(event.newData.fee_type.length)
  this.log.consoleLog(event.newData.fee_name.trim().length);
if((event.newData.fee_name.trim().length<1 || event.newData.fee_type.length <1)){
 return true;
}
else {
  this.log.consoleLog('validateFunction1');
     return this.feesDetails.find((fees) => {
       this.log.consoleLog((fees.fee_name.toUpperCase() === event.newData.fee_name.trim().toUpperCase()) || (fees.fee_type == event.newData.fee_type) );
       this.log.consoleLog('validateFunction');
                  return ((fees.fee_name.toUpperCase().trim() === event.newData.fee_name.trim().toUpperCase()) || (fees.fee_type == event.newData.fee_type)); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.fee_name.length);
if(event.newData.fee_name.trim().length<1 || event.newData.fee_type.trim().length <1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.feesDetails.find((fees) => {
               this.log.consoleLog((fees.fee_name.toUpperCase()===event.newData.fee_name.trim().toUpperCase()) && (fees.fee_type === event.newData.fee_type));
                return((fees.fee_name.toUpperCase()===event.newData.fee_name.trim().toUpperCase()) && (fees.fee_type === event.newData.fee_type));
                   
                });
               
}
                    

}
}
