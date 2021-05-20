import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {MstReligionType} from './mstreligion';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!./mstreligion.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
  selector: 'mstreligion',
 styleUrls: ['./modals.scss'],
  templateUrl: './mstreligion.html',
  providers:[DbService,Logs]
})
export class MstReligionComponent implements OnInit {
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
      txtReligionName: {
        title: 'Religion Name',
        type: 'string'
      },
      /*isActive: {
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


 loadData() {

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','intReligionId,txtReligionName');
    
       this.dbService.query('mstreligion','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((religion) => {
                    this.religions.push(MstReligionType.fromJson(religion));
                    this.log.consoleLog(this.religions.length);
                });
           this.log.consoleLog(this.religions);
             this.source.load(this.religions);
        
            
    
}
        ) }


  query: string = '';
religions=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs) {

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
        this.dbService.insert('mstreligion',this.event.newData).subscribe((data)=>this.log.consoleLog(data));
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
        queryFilters.set('filter','intReligionId ='+this.event.newData.intReligionId);

    this.dbService.update('mstreligion',this.event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','intReligionId ='+event.newData.intReligionId);

    this.dbService.update('mstreligion',event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('mstreligion',event.newData).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.txtReligionName.trim().length);
if(event.newData.txtReligionName.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.religions.find((religion) => {
       this.log.consoleLog(religion.txtReligionName.toUpperCase() === event.newData.txtReligionName.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (religion.txtReligionName.toUpperCase().trim() === event.newData.txtReligionName.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.txtReligionName.trim().length);
if(event.newData.txtReligionName.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.religions.find((religion) => {
               this.log.consoleLog((religion.txtReligionName.toUpperCase()===event.newData.txtReligionName.trim().toUpperCase()));
                return((religion.txtReligionName.toUpperCase()===event.newData.txtReligionName.trim().toUpperCase()));
                   
                });
               
}
                    

}
}
