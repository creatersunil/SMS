import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';
//import { BaseHttpService} from '../../../../dbservices/base-http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Affiliation} from './master-affiliation';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'affiliation',
styleUrls: ['./modals.scss'],
  templateUrl: './master-affiliation.html',
  providers:[DbService,Logs]
})
export class MasterAffiliationComponent implements OnInit {

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
     width:'',
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
      txtAffiliation: {
        title: 'Affiliation',
        type: 'string',
        width:''
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


 loadData() {

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','intAffiliationId,txtAffiliation');
    
       this.dbService.query('mstaffiliation','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((affiliations) => {
                    this.affiliations.push(Affiliation.fromJson(affiliations));
                    this.log.consoleLog(this.affiliations.length);
                });
           this.log.consoleLog(this.affiliations);
             this.source.load(this.affiliations);
        
            
    
}) 
}


  query: string = '';
affiliations=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs) {

  }

  

  // onEditConfirm(event): void {
  //   this.log.consoleLog(event);
  //   if (window.confirm('Are you sure you want to Update?')) {

  //     event.confirm.resolve();
  //      if(!this.onEditValidate(event))
  //     {
  //      this.log.consoleLog(JSON.stringify(event.newData));
  //    var queryFilters = new URLSearchParams();
  //      queryFilters.set('filter','intAffiliationId ='+event.newData.intAffiliationId);

  //   this.dbService.update('mstaffiliation',event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
  //     }
 
  //     //this.log.consoleLog(event);
  //   } else {
  //     event.confirm.reject();
  //   }
  // }




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
       this.dbService.insert('mstaffiliation',this.event.newData).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','intAffiliationId ='+this.event.newData.intAffiliationId);

    this.dbService.update('mstaffiliation',this.event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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



  // onCreateConfirm(event,dialog): void {
   
  //   this.log.consoleLog(JSON.stringify(event.newData))
  //   if (window.confirm('Are you sure you want to add?')) {
  //     event.confirm.resolve();
  //     if(!this.validateData(event))
  //     {
  //      this.log.consoleLog(JSON.stringify(event.newData));
  //      this.dbService.insert('mstaffiliation',event.newData).subscribe((data)=>this.log.consoleLog(data));
  //     }
      
      
  //   } else {
  //     event.confirm.reject();
  //   }
  // }


/**
 * 
 * @param event validation of records on create function
 */
validateData(event):Boolean
{
  
  this.log.consoleLog(event.newData.txtAffiliation.trim().length);
if(event.newData.txtAffiliation.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.affiliations.find((affiliations) => {
       this.log.consoleLog(affiliations.txtAffiliation.toUpperCase() === event.newData.txtAffiliation.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (affiliations.txtAffiliation.toUpperCase().trim() === event.newData.txtAffiliation.trim().toUpperCase()); 
                  
                });
               
}

}

/**
 * 
 * @param event validtaion of data on edit function
 */
onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.txtAffiliation.trim().length);
if(event.newData.txtAffiliation.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.affiliations.find((affiliations) => {
               this.log.consoleLog((affiliations.txtAffiliation.toUpperCase()===event.newData.txtAffiliation.trim().toUpperCase()));
                return((affiliations.txtAffiliation.toUpperCase()===event.newData.txtAffiliation.trim().toUpperCase()) );
                   
                });
               
}
}


}
