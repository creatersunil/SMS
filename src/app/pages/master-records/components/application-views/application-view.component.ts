import {Component, OnInit} from '@angular/core';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray} from '@angular/forms';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {DbService } from '../../../../services';
import {Logs} from '../../../../services';

import {ViewList} from './view-list';
@Component({
  selector: 'application-view',
  templateUrl: './application-view.html',
   providers:[DbService,Logs]
})
export class ApplicationViewComponent implements OnInit {
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }
  myForm:FormGroup;
  constructor(private formBuilder :FormBuilder,private dbService:DbService,private router:Router,private log:Logs) {
     this.myForm = formBuilder.group({
        
        'canEdit' :[false],
        'canDelete':[false],
        'canQuery':[false],
        'canUpdate':[false],
        'canView':[false],
        'canSearch':[false],
        'canViewOnlyMine':[false]
         
     });
  }


selectedviewId:any;
selectedviewName:any;

  onselect(viewvalue)
{
  this.selectedviewId=viewvalue;
  //this.log.consoleLog(this.myForm.getRawValue());
   this.log.consoleLog(viewvalue)

   this.viewlist.filter((viewData)=>{

      if(viewData.viewId == viewvalue)
        this.selectedviewName = viewData.viewName;

   });

   this.log.consoleLog(this.selectedviewName);
}

// onSubmit(){
//   this.log.consoleLog(this.myForm.getRawValue());
// }


viewlist=[];
loadData() {

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','viewId,viewName,Active');
    
       this.dbService.query('cfg_view_list','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((viewlist) => {
                    this.viewlist.push(ViewList.fromJson(viewlist));
                    this.log.consoleLog(this.viewlist.length);
                });
           this.log.consoleLog(this.viewlist);
             //this.source.load(this.viewlist);
        
            
    
        })
  }

  onInsertMongo(_view_id,_view_name,_view_actions){
    var doc={
        view_id:_view_id,
        view_name:_view_name,
        view_actions:_view_actions
    }
    return doc;
  }

  onsubmit(){
    this.selectedviewId=parseInt(this.selectedviewId)
         this.log.consoleLog(this.onInsertMongo(this.selectedviewId,this.selectedviewName,this.myForm.getRawValue()))
            this.dbService.insertMongo('application_views',this.onInsertMongo(this.selectedviewId,this.selectedviewName,this.myForm.getRawValue())).subscribe((data)=>this.log.consoleLog(data));
  }



}