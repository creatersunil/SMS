import {Component, OnInit} from '@angular/core';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray,FormsModule} from '@angular/forms';
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
import {GroupView} from './group-view';
@Component({
  selector: 'group-view-access',
  templateUrl: './group-view-acces.html',
   providers:[DbService,Logs]
})
export class GroupViewAccessComponent implements OnInit {
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
selectedViewName:any;
selectedGroupName:any;
  onselect(viewvalue)
{
  this.selectedviewId=(viewvalue);
  this.log.consoleLog(this.selectedviewId);
  
  this.groupviewaccess.filter((viewData)=>{
    if(viewData.id == viewvalue)
    this.selectedViewName=viewData.view_name;
  
  });
  this.groupviewaccess.filter((viewData)=>{
    if(viewData.id == viewvalue)
  
    this.selectedGroupName=viewData.group_name;
  });


  
  this.log.consoleLog(this.selectedViewName);
  this.log.consoleLog(this.selectedGroupName);
}


groupviewaccess=[];
loadData() {

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','id,group_name,view_name');
    
       this.dbService.query('cfg_group_default_views','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((groupviewaccess) => {
                    this.groupviewaccess.push(GroupView.fromJson(groupviewaccess));
                    this.log.consoleLog(this.groupviewaccess.length);
                });
           this.log.consoleLog(this.groupviewaccess);
             //this.source.load(this.viewlist);
        
            
    
        })
  }

  onInsertMongo(_group_name,_view_id,_view_name,_view_actions){
    var doc={
        group_name:_group_name,
        view_id:_view_id,
        view_name:_view_name,
        view_actions:_view_actions
    }
    return doc;
  }

  onsubmit(){
    this.selectedviewId=parseInt(this.selectedviewId)
         this.log.consoleLog(this.onInsertMongo(this.selectedGroupName,this.selectedviewId,this.selectedViewName,this.myForm.getRawValue()))
            this.dbService.insertMongo('group_view_access',this.onInsertMongo(this.selectedGroupName,this.selectedviewId,this.selectedViewName,this.myForm.getRawValue())).subscribe((data)=>this.log.consoleLog(data));
  }



}