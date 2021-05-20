import {Component, OnInit} from '@angular/core';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray,AbstractControl} from '@angular/forms';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {DbService ,UserConfig} from '../../../../services';
import {Logs} from '../../../../services';

import {MstSectionType} from './mst_section';
import {MstClassType} from './mst_class'
import {CSCT} from './master-csct';
import {Registrstiondetails} from './mst-registration'
@Component({
  selector: 'master-csct',
  styleUrls: ['./modals.scss'],
  templateUrl: './master-csct.html',
   providers:[DbService,Logs,UserConfig]
})
export class MasterCSCtComponent implements OnInit {
  date:number;
  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
    this.loadClassdata();
    this.loadSectionData();
  }

  myForm:FormGroup;
  public intRegistrationId:AbstractControl;
  public class_id:AbstractControl;
  public section_id:AbstractControl;

  constructor(private formBuilder :FormBuilder,private dbService:DbService,private router:Router,private log:Logs,private userConfig:UserConfig) {
     this.myForm = formBuilder.group({
        
        'intRegistrationId' :[''],
        'class_id':[''],
        'section_id':[''],
        // 'canUpdate':[false],
        // 'canView':[false],
        // 'canSearch':[false],
        // 'canViewOnlyMine':[false]
         
     });

                this.intRegistrationId = this.myForm.controls['intRegistrationId'];
                this.class_id = this.myForm.controls['class_id'];
                this.section_id = this.myForm.controls['section_id'];
  }


selectedviewId:any;
selectedviewName:any;




staffDetails=[];
loginId:number;
loadData() {

         this.loginId=this.userConfig.getRegId();
        
         this.dbService.getDateTime('getDate').subscribe((date)=>{
         this.date = date;
         this.log.consoleLog(this.date);
         });

        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','intRegistrationId,txtFirstName,txtLastName');
    
       this.dbService.query('mst_registration','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((staffDetails) => {
                    this.staffDetails.push(Registrstiondetails.fromJson(staffDetails));
                    this.log.consoleLog(this.staffDetails.length);
                });
           this.log.consoleLog(this.staffDetails);
             //this.source.load(this.viewlist);
        
            
    
        })
  }

  className=[];
 loadClassdata() {
   
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','class_id,class_name');
    
       this.dbService.query('mst_classes','',queryFilters).subscribe((result)=>{

            var data: any = result.json();            
              data.resource.forEach((className) => {
                    this.className.push(MstClassType.fromJson(className));
                    this.log.consoleLog(this.className.length);
                });
           this.log.consoleLog(this.className);
        });
}


sectionList=[];
 loadSectionData() {
   
        var queryFilters = new URLSearchParams();
        queryFilters.set('fields','section_id,section_name');
        this.dbService.query('mst_sections','',queryFilters).subscribe((result)=>{
        var data: any = result.json();            
        data.resource.forEach((sectionList) => {
        this.sectionList.push(MstSectionType.fromJson(sectionList));
        this.log.consoleLog(this.sectionList.length);
        });
        this.log.consoleLog(this.sectionList);
       });
}

  onInsertDoc(){
    var doc={
       techer_id:this.intRegistrationId.value,
       class_id:this.class_id.value,
       section_id:this.section_id.value,
       created_date:this.date,
       created_by:this.loginId
    }
    return doc;
  }

  
onsubmit(){
  this.log.consoleLog(this.myForm.getRawValue());
  this.log.consoleLog(this.onInsertDoc());
}




}