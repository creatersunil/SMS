import {Component,OnInit,ViewChild} from '@angular/core';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Cities} from './master-city';
import { LocalDataSource } from 'ng2-smart-table';
import {DbService } from '../../../../services';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import 'style-loader!../master-records.scss';
import {States} from '../master-state';
import {Logs} from '../../../../services';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'city',
 styleUrls: ['./modals.scss'],
  templateUrl: './master-city.html',
  providers:[DbService,Logs]
})
export class MasterCityComponent implements OnInit {
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
      
     
      txtCityName: {
        title: 'CityName',
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
         queryFilters.set('fields','intStateId,txtStateName');
    
       this.dbService.query('mststate','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((states) => {
                    this.states.push(States.fromJson(states));
                    this.log.consoleLog(this.states.length);
                });
           this.log.consoleLog(this.states);
             //this.source.load(this.states);
        
            
    
        })
}


stateId:any;
onselect(intStateId:number):void
    {
      this.stateId=intStateId;
       var queryFilters = new URLSearchParams();
       queryFilters.set('filter','intStateId= '+intStateId);
       queryFilters.set('fields','txtCityName,intCityId,intStateId')
       this.dbService.query('mstcity','',queryFilters).subscribe((result)=>{

             var data: any = result.json();  
                    this.cities=[];
              data.resource.forEach((cities) => {
                    this.cities.push(Cities.fromJson(cities));
                    this.log.consoleLog(this.cities.length);
                });
           
           this.log.consoleLog(this.source.count());
            // this.source.empty();
            // this.source.refresh();
              
             this.source.load(this.cities);
            
        })

    }


  query: string = '';
 cities=[];
 states=[];
  constructor(private dbService:DbService,private router:Router,private log:Logs) {

  }

  
onCreateDoc(_intStateId,_txtCityName){
  var doc={
      intStateId:_intStateId,
      
      txtCityName:_txtCityName

  }
  return doc;
}

onEditDoc(_txtCityName){
   var doc={
      
      
      txtCityName:_txtCityName

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
       this.log.consoleLog(JSON.stringify(this.onCreateDoc(this.stateId,this.event.newData.txtCityName)));
       this.dbService.insert('mstcity',this.onCreateDoc(this.stateId,this.event.newData.txtCityName)).subscribe((data)=>this.log.consoleLog(data));
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
      this.log.consoleLog(JSON.stringify(this.onEditDoc(this.event.newData.txtCityName)));
     var queryFilters = new URLSearchParams();
       queryFilters.set('filter','intCityId ='+this.event.newData.intCityId);

    this.dbService.update('mstcity',this.event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      queryFilters.set('filter','intCityId ='+event.newData.intCityId);

  //   this.dbService.update('mstcity',event.newData,queryFilters).subscribe((data)=>this.log.consoleLog(data));
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
  //      this.dbService.insert('mstcity',event.newData).subscribe((data)=>this.log.consoleLog(data));
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
  
  this.log.consoleLog(event.newData.txtCityName.trim().length);
if(event.newData.txtCityName.trim().length<1){
 return true;
}
else {
 
     return this.cities.find((city) => {
       this.log.consoleLog(city.txtCityName.toUpperCase() === event.newData.txtCityName.trim().toUpperCase());
      
                  return (city.txtCityName.toUpperCase().trim() === event.newData.txtCityName.trim().toUpperCase()); 
                  
                });
               
}

}


onEditValidate(event):Boolean
{
  this.log.consoleLog(event.newData.txtCityName.trim().length);
if(event.newData.txtCityName.trim().length<1){
  return true;
}
else {
  this.log.consoleLog('else');
    return this.cities.find((city) => {
               this.log.consoleLog(city.txtCityName.toUpperCase()===event.newData.txtCityName.trim().toUpperCase() );
                return(city.txtCityName.toUpperCase()===event.newData.txtCityName.trim().toUpperCase());
                   
                });
               
}
                    

}
}
