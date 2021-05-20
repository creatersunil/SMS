import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService ,UserConfig } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';

import {FeeTypeDetails} from './master-fee-type-details';
import {FeesDetails} from './master-fee-type';
 
@Component({
  selector: 'master-fee-type-details',
 styleUrls: ['./modals.scss'],
  templateUrl: './master-fee-type-details.html',
  providers:[DbService,Logs,UserConfig]
})
export class MasterFeeTypeDetails implements OnInit {
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
   //this.onSelectMaxValue();
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
       fee_name: {
       title:'fee Name',
       type:'string'
       },
      year:{
       title:'For the Year',
       type:'text'
      },
      is_active: {
        title: 'IsActive',
        editor: {
        type: 'checkbox',
        config:{
          true:"1",
          false:"0"
        }
        }
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();
  query: string = '';
 feetypes=[];
 feetypedetail=[];
 date:number;
  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

 

 loginId:any;
 loadData() {
        this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
         queryFilters.set('fields','fee_type,fee_name');
    
       this.dbService.query('mst_fees_types','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((feetypes) => {
                    this.feetypes.push(FeesDetails.fromJson(feetypes));
                    this.log.consoleLog(this.feetypes.length);
                });
           this.log.consoleLog(this.feetypes);
            })
            
}

getDate()
{
    this.dbService.getDateTime('getDate').subscribe((date)=>{
        this.date = date;
        this.log.consoleLog(this.date)
    });
}

feesType:any;
onselect(fee_type):void
    {
        this.feesType=parseInt(fee_type);
       var queryFilters = new URLSearchParams();
       this.log.consoleLog(fee_type);
       queryFilters.set('filter','fee_type= '+fee_type);
       queryFilters.set('fields','fee_type,fee_name,created_date,year,is_active,fees_ref_id')
       this.dbService.query('mst_fees_details','',queryFilters).subscribe((result)=>{

             var data: any = result.json();  
                    this.feetypedetail=[];
              data.resource.forEach((feetypedetail) => {
                    this.feetypedetail.push(FeeTypeDetails.fromJson(feetypedetail));
                    this.log.consoleLog(this.feetypedetail.length);
                });
           
           this.log.consoleLog(this.source.count());
          this.source.load(this.feetypedetail);
            
        })

    }


 onCreateInsertDb(_fee_type,_fee_name,_created_date,_year,_is_active,_created_by){
      var doc={
          fee_type:_fee_type,
          fee_name:_fee_name,
          created_date:_created_date,
          year:_year,
          is_active:_is_active,
          created_by:_created_by
      }
      return doc;
 }

  onEditInsertDb(_fee_name,_year,_is_active,_edited_by){
      var doc={
          
          fee_name:_fee_name,
         
          year:_year,
          is_active:_is_active,
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
      this.log.consoleLog(this.onCreateInsertDb(this.feesType,this.event.newData.fee_name,this.date,this.event.newData.year,this.event.newData.is_active,this.loginId))
       this.dbService.insert('mst_fees_details',this.onCreateInsertDb(this.feesType,this.event.newData.fee_name,this.date,this.event.newData.year,this.event.newData.is_active,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','fees_ref_id ='+this.event.newData.fees_ref_id);

    this.dbService.update('mst_fees_details',this.onEditInsertDb(this.event.newData.fee_name,this.event.newData.year,this.event.newData.is_active,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      queryFilters.set('filter','fees_ref_id ='+event.newData.fees_ref_id);

  //   this.dbService.update('mst_fees_details',this.onEditInsertDb(event.newData.fee_name,event.newData.year,event.newData.is_active,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      this.log.consoleLog(this.onCreateInsertDb(this.feesType,event.newData.fee_name,this.date,event.newData.year,event.newData.is_active,this.loginId))
  //      this.dbService.insert('mst_fees_details',this.onCreateInsertDb(this.feesType,event.newData.fee_name,this.date,event.newData.year,event.newData.is_active,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.fee_name.trim().length);
if(event.newData.fee_name.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.feetypedetail.find((feetypedetail) => {
       this.log.consoleLog(feetypedetail.fee_name.toUpperCase() === event.newData.fee_name.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (feetypedetail.fee_name.toUpperCase().trim() === event.newData.fee_name.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.fee_name.trim().length);
if(event.newData.fee_name.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.feetypedetail.find((feetypedetail) => {
               this.log.consoleLog((feetypedetail.fee_name.toUpperCase()===event.newData.fee_name.trim().toUpperCase()) && (feetypedetail.is_active == event.newData.is_active)&& (feetypedetail.year == event.newData.year));
                return((feetypedetail.fee_name.toUpperCase()===event.newData.fee_name.trim().toUpperCase()) && (feetypedetail.year == event.newData.year));
                   
                });
               
}
                    

}
}
