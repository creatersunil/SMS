import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {MstSectionType} from './mst_section';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService ,UserConfig} from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!./mst_section.scss';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
  selector: 'mst_section',
 styleUrls: ['./modals.scss'],
  templateUrl: './mst_section.html',
  providers:[DbService,Logs,UserConfig]
})
export class MstSectionComponent implements OnInit {
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
      section_name: {
        title: 'Section-Name',
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
sectionList=[];
 loadData() {
    this.loginId=this.userConfig.getRegId();
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','section_id,section_name');
    
       this.dbService.query('mst_sections','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((sectionList) => {
                    this.sectionList.push(MstSectionType.fromJson(sectionList));
                    this.log.consoleLog(this.sectionList.length);
                });
           this.log.consoleLog(this.sectionList);
             this.source.load(this.sectionList);
        
            
    
}
        ) }


  query: string = '';

  constructor(private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {

  }

  onCreateDoc(_section_name,_created_by){
      var doc={
        section_name:_section_name,
        created_by:_created_by
      }
      return doc;
  }

    onEditDoc(_section_name,_edited_by){
      var doc={
        section_name:_section_name,
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
       this.dbService.insert('mst_sections',this.onCreateDoc(this.event.newData.section_name,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
 queryFilters.set('filter','section_id ='+this.event.newData.section_id);

    this.dbService.update('mst_sections',this.onEditDoc(this.event.newData.section_name,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       queryFilters.set('filter','section_id ='+event.newData.section_id);

    this.dbService.update('mst_sections',this.onEditDoc(event.newData.section_name,this.loginId),queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
       this.dbService.insert('mst_sections',this.onCreateDoc(event.newData.section_name,this.loginId)).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.section_name.trim().length);
if(event.newData.section_name.trim().length<1){
 return true;
}
else {
  this.log.consoleLog('validateFunction');
     return this.sectionList.find((sectionList) => {
       this.log.consoleLog(sectionList.section_name.toUpperCase() === event.newData.section_name.trim().toUpperCase());
       this.log.consoleLog('validateFunction');
                  return (sectionList.section_name.toUpperCase().trim() === event.newData.section_name.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.section_name.trim().length);
if(event.newData.section_name.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.sectionList.find((sectionList) => {
               this.log.consoleLog((sectionList.section_name.toUpperCase()===event.newData.section_name.trim().toUpperCase()) /*&& (leave.isActive == event.newData.isActive)*/);
                return((sectionList.section_name.toUpperCase()===event.newData.section_name.trim().toUpperCase()) /*&& (leave.isActive == event.newData.isActive)*/);
                   
                });
               
}
                    

}
}
