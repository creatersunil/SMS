import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {SocialCategory} from './master-social-category';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'week',
 styleUrls: ['./modals.scss'],
  templateUrl: './master-social-category.html',
  providers:[DbService,Logs]
})
export class MasterSocialCategoryComponent implements OnInit {
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
      txtSocialCategory: {
        title: 'Social Category Name',
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


 loadData() {

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','intSocialCategoryId,txtSocialCategory');
    
       this.dbService.query('mstsocialcategory','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((categories) => {
                    this.categories.push(SocialCategory.fromJson(categories));
                    this.log.consoleLog(this.categories.length);
                });
           this.log.consoleLog(this.categories);
             this.source.load(this.categories);
        
            
    
}
        ) }


  query: string = '';
categories=[];
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
       this.dbService.insert('mstsocialcategory',this.event.newData).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','intSocialCategoryId ='+this.event.newData.intSocialCategoryId);

    this.dbService.update('mstsocialcategory',this.event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','intSocialCategoryId ='+event.newData.intSocialCategoryId);

    this.dbService.update('mstsocialcategory',event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('mstsocialcategory',event.newData).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.txtSocialCategory.trim().length);
if(event.newData.txtSocialCategory.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.categories.find((categories) => {
       this.log.consoleLog(categories.txtSocialCategory.toUpperCase() === event.newData.txtSocialCategory.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (categories.txtSocialCategory.toUpperCase().trim() === event.newData.txtSocialCategory.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.txtSocialCategory.trim().length);
if(event.newData.txtSocialCategory.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.categories.find((categories) => {
               this.log.consoleLog((categories.txtSocialCategory.toUpperCase()===event.newData.txtSocialCategory.trim().toUpperCase()) );
                return((categories.txtSocialCategory.toUpperCase()===event.newData.txtSocialCategory.trim().toUpperCase()) );
                   
                });
               
}
                    

}
}
