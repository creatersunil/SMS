import {Component ,OnInit,ViewChild} from '@angular/core';
import { FormGroup ,FormControl, Validators,FormBuilder,FormArray,AbstractControl} from '@angular/forms';
import { URLSearchParams,Headers, RequestOptions } from '@angular/http';
import { Router,RouterModule,ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {DbService ,UserConfig} from '../../../../services';
import { Logs } from '../../../../services';
import { Injectable, Pipe, PipeTransform } from '@angular/core';
import {Classes} from '../classes';
import {Sections} from '../section';
import {Affiliation} from '../affiliation';
import {OnlyNumber} from '../../../../utils';
import {Religion} from '../religion';
import {Disability} from '../disability';
import {SocialCatagory} from '../social-catagory';
import {Cities} from '../cities';
import {States} from '../master-state';
import {Country} from '../country';
import {MotherTongue} from '../motherTongue';
import {District} from '../district';
import {Taluk} from '../taluk';
import {UserType} from '../master-user-type';
import {GroupName} from '../group-name';
import {StudentTableDataType} from '../studentTableData';
import {RegitrationTableDataType} from '../registrationTableData';
import { NgUploaderOptions } from 'ngx-uploader';
import { ModalDirective } from 'ng2-bootstrap';
@Component({
  selector: 'student-profile',
  templateUrl: './student-profile.html',
  styleUrls: ['./modals.scss'],
   providers:[DbService,Logs,UserConfig]
})
export class StudentProfileComponent implements OnInit{
  myForm:FormGroup;
  religions=[];
  mother_Tounges=[];
  disabilities=[];
  socialCatagory=[];
  cities=[];
  m_tongue=[];
  classes = [];
  sections=[];
  affiliations=[];
  groupname=[];
  usertype=[];
  countries=[];
  states=[];
  studentTableData=[];
registrationTableData=[];
registration:any;
studentData:any;
loggedId:any;
district=[];
  taluk=[];

 @ViewChild('childModal') childModal: ModalDirective;

  showChildModal(): void {  
    this.childModal.show();
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  print(): void {
    let printContents, popupWin;
    //printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()"></body>
      </html>`
    );
    popupWin.document.close();
}
 ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadData();
  }

belongToBPL =[
    {value :'1',viewValue :'Yes'},
    {value :'0' ,viewValue :'No'}
  ]
   Disabled =[
    {value :'1' ,viewValue :'Yes'},
    {value :'0' ,viewValue :'No'} 
  ]
  genders =[
     {value :'1' ,viewValue :'male'},
     {value :'0' ,viewValue :'female'}
  ] 

   private subscription;
    id:string;
  public intClassId:AbstractControl;
  public intSectionId:AbstractControl;
  constructor(private formBuilder :FormBuilder,private userConfig:UserConfig,private dbService:DbService,private router:Router,private log:Logs,private activatedRoute:ActivatedRoute) {
 this.subscription= activatedRoute.params.subscribe(
                              (param: any) =>{this.id = param['id']
                                    this.log.consoleLog('id'+this.id);
                              });
this.loadstudentdata(this.id);


this.myForm = formBuilder.group({
                                        'txtFirstName' :['', Validators.required],
                                        'txtMiddleName' :['', Validators.required],
                                        'txtLastName' :['', Validators.required],
                                        'txtEmailId' : ['', 
                                                     [Validators.required , 
                                                      Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
                                                   ]],
                                         'dtDOB' :['', Validators.required],
                                         'dtJoiningDate' :['', Validators.required], 
                                         'txtFatherName' :['', Validators.required], 
                                         'txtFOccupation' :['', Validators.required],
                                         'txtFEducationalQualification' :['', Validators.required], 
                                         'txtMotherName' :['', Validators.required],
                                         'txtMEducationalQualification' :['', Validators.required],
                                         'txtMOccupation':['', Validators.required],
                                         'intGenderId' :['1', Validators.required],
                                         'intmothertongueId':['', Validators.required],
                                         'intReligionId' :['', Validators.required], 
                                         'bloodGroup' :['', Validators.required],
                                         'txtAadharNumber' :['', Validators.required], 
                                         'txtNationality' :['', Validators.required],
                                         'blBelongToBPL' :['', Validators.required],
                                         'txtBPLCardNo' :['', Validators.required],
                                         'isDisabled' :['', Validators.required],
                                         'intDisabilityId':['', Validators.required],
                                         'intSocialCategoryId':['', Validators.required],
                                         'txtLocality' :['', Validators.required],
                                         'txtTaluk' :['', Validators.required],
                                         'txtDistrict' :['', Validators.required],
                                         'intCityId':['', Validators.required],
                                         'txtPincode' :['', Validators.required],
                                         'txtPerAddress' :['', Validators.required],
                                         'txtTempAddress' :['', Validators.required],
                                         'intStateId':['',Validators.required],
                                          'intClassId' :['', Validators.required],
                                          'intAffiliationId':['', Validators.required],
                                           'intSectionId':['', Validators.required],
                                           'nmParentsAnnualIncome':['', Validators.required],
                                           'txtStudentCaste' :['', Validators.required],
                                           'txtStudentCasteCertificateNo':['', Validators.required],
                                           'txtPreviousSchoolName':['', Validators.required],
                                           'txtPreviousSchoolAddress':['', Validators.required],
                                           'txtTransferCertificateNo':['', Validators.required],
                                           'dtTransferCertificateDate':['', Validators.required],
                                           'txtFathersCasteCertificateNo' :['', Validators.required],
                                            'txtFathersCaste' :['', Validators.required],
                                            'fatherEducation' :['', Validators.required],
                                            'txtMothersCaste' :['', Validators.required],
                                            'txtMothersCasteCertificateNo' :['', Validators.required],
                                            'txtFOtherNumber' :['', Validators.required],
                                            'txtFMobileNumber' :['', Validators.required],
                                            'txtMMobileNumber' :['', Validators.required],
                                            'txtMOtherNumber' :['', Validators.required],
                                              'motherAadharNo' :['', Validators.required],
                                            'dtAdmissionDate' :['', Validators.required],
                                            'txtStudentEnrollmentNumber' :['', Validators.required],
                                             'fatherAadharNo':['2'],
                                             'group_name':['']         
                                                 });


                  this.intClassId                   =this.myForm.controls['intClassId'];
                 this.intSectionId                 = this.myForm.controls['intSectionId'];
                                                  

  }


bindRegistrationFormValues(){
(<FormControl>this.myForm.controls['txtFirstName'])
 .setValue(this.registration.txtFirstName, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMiddleName'])
 .setValue(this.registration.txtMiddleName, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtLastName'])
 .setValue(this.registration.txtLastName, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtEmailId'])
 .setValue(this.registration.txtEmailId, { onlySelf: true });
 (<FormControl>this.myForm.controls['dtDOB'])
 .setValue(this.registration.dtDOB, { onlySelf: true });
 (<FormControl>this.myForm.controls['dtJoiningDate'])
 .setValue(this.registration.dtJoiningDate, { onlySelf: true });
  (<FormControl>this.myForm.controls['txtFatherName'])
 .setValue(this.registration.txtFatherName, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtFOccupation'])
 .setValue(this.registration.txtFOccupation, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtFEducationalQualification'])
 .setValue(this.registration.txtFEducationalQualification, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMotherName'])
 .setValue(this.registration.txtMotherName, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMEducationalQualification'])
 .setValue(this.registration.txtMEducationalQualification, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMOccupation'])
 .setValue(this.registration.txtMOccupation, { onlySelf: true });
 (<FormControl>this.myForm.controls['intGenderId'])
 .setValue(this.registration.intGenderId, { onlySelf: true });
  (<FormControl>this.myForm.controls['intmothertongueId'])
 .setValue(this.registration.intmothertongueId, { onlySelf: true });
 (<FormControl>this.myForm.controls['intReligionId'])
 .setValue(this.registration.intReligionId, { onlySelf: true });
 (<FormControl>this.myForm.controls['bloodGroup'])
 .setValue(this.registration.bloodGroup, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtAadharNumber'])
 .setValue(this.registration.txtAadharNumber, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtNationality'])
 .setValue(this.registration.txtNationality, { onlySelf: true });
  (<FormControl>this.myForm.controls['blBelongToBPL'])
 .setValue(this.registration.blBelongToBPL, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtBPLCardNo'])
 .setValue(this.registration.txtBPLCardNo, { onlySelf: true });
  (<FormControl>this.myForm.controls['isDisabled'])
 .setValue(this.registration.isDisabled, { onlySelf: true });
 (<FormControl>this.myForm.controls['intDisabilityId'])
 .setValue(this.registration.intDisabilityId, { onlySelf: true });
 (<FormControl>this.myForm.controls['intSocialCategoryId'])
 .setValue(this.registration.intSocialCategoryId, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtLocality'])
 .setValue(this.registration.txtLocality, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtTaluk'])
 .setValue(this.registration.txtTaluk, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtDistrict'])
 .setValue(this.registration.txtDistrict, { onlySelf: true });
 (<FormControl>this.myForm.controls['intCityId'])
 .setValue(this.registration.intCityId, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtPincode'])
 .setValue(this.registration.txtPincode, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtPerAddress'])
 .setValue(this.registration.txtPerAddress, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtTempAddress'])
 .setValue(this.registration.txtTempAddress, { onlySelf: true });
  (<FormControl>this.myForm.controls['intStateId'])
 .setValue(this.registration.intStateId, { onlySelf: true });
 (<FormControl>this.myForm.controls['group_name'])
 .setValue(this.registration.group_name, { onlySelf: true });
}

bindStudentFormValues(){

(<FormControl>this.myForm.controls['intClassId'])
 .setValue(this.studentData.intClassId, { onlySelf: true });
 (<FormControl>this.myForm.controls['intAffiliationId'])
 .setValue(this.studentData.intAffiliationId, { onlySelf: true });
 (<FormControl>this.myForm.controls['intSectionId'])
 .setValue(this.studentData.intSectionId, { onlySelf: true });
 (<FormControl>this.myForm.controls['nmParentsAnnualIncome'])
 .setValue(this.studentData.nmParentsAnnualIncome, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtStudentCaste'])
 .setValue(this.studentData.txtStudentCaste, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtStudentCasteCertificateNo'])
 .setValue(this.studentData.txtStudentCasteCertificateNo, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtPreviousSchoolName'])
 .setValue(this.studentData.txtPreviousSchoolName, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtPreviousSchoolAddress'])
 .setValue(this.studentData.txtPreviousSchoolAddress, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtTransferCertificateNo'])
 .setValue(this.studentData.txtTransferCertificateNo, { onlySelf: true });
 (<FormControl>this.myForm.controls['dtTransferCertificateDate'])
 .setValue(this.studentData.dtTransferCertificateDate, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtFathersCasteCertificateNo'])
 .setValue(this.studentData.txtFathersCasteCertificateNo, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtFathersCaste'])
 .setValue(this.studentData.txtFathersCaste, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMothersCaste'])
 .setValue(this.studentData.txtMothersCaste, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMothersCasteCertificateNo'])
 .setValue(this.studentData.txtMothersCasteCertificateNo, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtFOtherNumber'])
 .setValue(this.studentData.txtFOtherNumber, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtFMobileNumber'])
 .setValue(this.studentData.txtFMobileNumber, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMMobileNumber'])
 .setValue(this.studentData.txtMMobileNumber, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtMOtherNumber'])
 .setValue(this.studentData.txtMOtherNumber, { onlySelf: true });
 (<FormControl>this.myForm.controls['dtAdmissionDate'])
 .setValue(this.studentData.dtAdmissionDate, { onlySelf: true });
 (<FormControl>this.myForm.controls['txtStudentEnrollmentNumber'])
 .setValue(this.studentData.txtStudentEnrollmentNumber, { onlySelf: true });
   (<FormControl>this.myForm.controls['fatherAadharNo'])
 .setValue(this.studentData.fatherAadharNo, { onlySelf: true });
  (<FormControl>this.myForm.controls['motherAadharNo'])
 .setValue(this.studentData.motherAadharNo, { onlySelf: true });

}


  onSubmit(dialog){

 this.updateRegistrationTable(dialog); 
 this.updateStudentTable(dialog);  
    //            this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
    //             var queryFilters = new URLSearchParams();
    //    queryFilters.set('filter','intRegistrationId= '+this.id);

    // this.dbService.update('mst_registration',this.myForm.getRawValue(),queryFilters).subscribe((data)=>this.log.consoleLog(data));
             }


updateRegistrationTable(dialog){
  this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
                var queryFilters = new URLSearchParams();
       queryFilters.set('filter','intRegistrationId= '+this.id);
    
    //Update records to database 
   
    this.dbService.update('mst_registration',this.myForm.getRawValue(),queryFilters).subscribe((data)=>{
      this.log.consoleLog(data);
      dialog.show();
     });

}

updateStudentTable(dialog){

   this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));
                var queryFilters = new URLSearchParams();
       queryFilters.set('filter','intRegistrationId= '+this.id);

    this.dbService.update('mst_student',this.myForm.getRawValue(),queryFilters).subscribe((data)=>{
      this.log.consoleLog(data);
    dialog.show()
  });

   queryFilters.set('filter','registration_id= '+this.id);

    this.dbService.update('map_student_cs',this.insertStudentRecordsCsDoc(),queryFilters).subscribe((data)=>{
      this.log.consoleLog(data);
    dialog.show()
  });


}


ProfilePage(){
    let tempvalue=this.router.url;
                  tempvalue=tempvalue.substring(0,tempvalue.lastIndexOf('/'));
                  this.log.consoleLog(tempvalue);
       let lastvalue=tempvalue.substring(0,tempvalue.lastIndexOf('/'));
       this.log.consoleLog(lastvalue);
       this.router.navigate([lastvalue+'/students-records-view']);

}


loadstudentdata(registration_id){
      this.log.consoleLog('registration_id '+registration_id);
               var queryFilters = new URLSearchParams();
               queryFilters.set('filter','intRegistrationId= '+registration_id);
               this.dbService.query('mst_student','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((studentTableData) => {
                    this.studentData=StudentTableDataType.fromJson(studentTableData); 
                    this.log.consoleLog(this.studentData); 
                });
                this.bindStudentFormValues();
          });

var queryFilters = new URLSearchParams();
       queryFilters.set('filter','intRegistrationId= '+registration_id);
       this.dbService.query('mst_registration','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((registrationTableData) => {
                   this.registration=RegitrationTableDataType.fromJson(registrationTableData); 
                    this.log.consoleLog(this.registration); 
                });
                this.bindRegistrationFormValues();
          })
}



 insertStudentRecordsCsDoc(){
       var doc={
         class_id:this.intClassId.value,
         section_id:this.intSectionId.value,
         created_by:this.loggedId
       }
       return doc;
 }



 loadData() {


           this.loggedId=this.userConfig.getRegId();

           var queryFilters = new URLSearchParams();
           queryFilters.set('fields','class_id,class_name');
           this.dbService.query('mst_classes','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((classes) => {
                    this.classes.push(Classes.fromJson(classes));
                    this.log.consoleLog(this.classes.length);
                });
                   this.log.consoleLog(data);
        
          })
          queryFilters.set('fields','section_id,section_name');
          this.dbService.query('mst_sections','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((sections) => {
                    this.sections.push(Sections.fromJson(sections));
                    this.log.consoleLog(this.classes.length);
                });
                   this.log.consoleLog(data);
        
          })
          queryFilters.set('fields','intAffiliationId,txtAffiliation');
          this.dbService.query('mstaffiliation','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((affiliations) => {
                    this.affiliations.push(Affiliation.fromJson(affiliations));
                    this.log.consoleLog(this.affiliations.length);
                });
                   this.log.consoleLog(data);
        
          })
           var queryFilters = new URLSearchParams();
                    queryFilters.set('fields','intReligionId,txtReligionName');
                     
                   this.dbService.query('mstreligion','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((religions) => {
                    this.religions.push(Religion.fromJson(religions));
                    this.log.consoleLog(this.religions.length);
                });
                   this.log.consoleLog(data);
        
          })
           queryFilters.set('fields','intDisabilityChildId,txtDisability');
                     
                   this.dbService.query('mstdisabilitychild','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((disabilities) => {
                    this.disabilities.push(Disability.fromJson(disabilities));
                    this.log.consoleLog(this.disabilities.length);
                });
                   this.log.consoleLog(data);
        
          })
          queryFilters.set('fields','intSocialCategoryId,txtSocialCategory');
                     
                   this.dbService.query('mstsocialcategory','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((socialCatagory) => {
                    this.socialCatagory.push(SocialCatagory.fromJson(socialCatagory));
                    this.log.consoleLog(this.socialCatagory.length);
                });
                   this.log.consoleLog(data);
        
          })
           queryFilters.set('fields','intCityId,txtCityName');
                     
                   this.dbService.query('mstcity','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((cities) => {
                    this.cities.push(Cities.fromJson(cities));
                    this.log.consoleLog(this.cities.length);
                });
                   this.log.consoleLog(data);
        
          })

             queryFilters.set('fields','intCountryId,txtCountryName');
                  this.dbService.query('mstcountry','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((countries) => {
                  this.countries.push(Country.fromJson(countries));
                  this.log.consoleLog(this.countries.length);
                  });
                  this.log.consoleLog(data);
                });

                queryFilters.set('fields','txtStateName,intStateId,intCountryId');
                  this.dbService.query('mststate','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((states) => {
                  this.states.push(States.fromJson(states));
                  this.log.consoleLog(this.states.length);
                  });
                  this.log.consoleLog(data);
                });
           queryFilters.set('fields','intmothertongueId,txtmothertongue');
                     
                   this.dbService.query('mstmothertongue','',queryFilters).subscribe((result)=>{

                  var data: any = result.json();            
                  data.resource.forEach((m_tongue) => {
                    this.m_tongue.push(MotherTongue.fromJson(m_tongue));
                    this.log.consoleLog(this.m_tongue.length);
                });
                   this.log.consoleLog(data);
        
          })

           queryFilters.set('fields','intDistrictId,txtDistrictName,intStateId');
                    this.dbService.query('mstdistrict','',queryFilters).subscribe((result)=>{
                    var data: any = result.json();            
                    data.resource.forEach((district) => {
                    this.district.push(District.fromJson(district));
                    this.log.consoleLog(this.district.length);
                     });
                    this.log.consoleLog(data);
                   });

                  queryFilters.set('fields','intTalukId,txtTalukName,intDistrictId');
                  this.dbService.query('msttaluk','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((taluk) => {
                  this.taluk.push(Taluk.fromJson(taluk));
                  this.log.consoleLog(this.taluk.length);
                   });
                   this.log.consoleLog(data);
                 });

                  queryFilters.set('fields','type_id,user_type');
                  this.dbService.query('mst_user_type','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((usertype) => {
                  this.usertype.push(UserType.fromJson(usertype));
                  this.log.consoleLog(this.usertype.length);
                   });
                  this.log.consoleLog(data); 
                });
                
                  queryFilters.set('fields','id,group_name');   
                  this.dbService.query('cfg_group_default_views','',queryFilters).subscribe((result)=>{
                  var data: any = result.json();            
                  data.resource.forEach((groupname) => {
                  this.groupname.push(GroupName.fromJson(groupname));
                  this.log.consoleLog(this.groupname.length);
                   });
                  this.log.consoleLog(data);
                });

          
      }



      //Disable BPL card Number If Not BPL crad holder
disabletable=true;
disableCardNumber(cardValue){
  this.log.consoleLog(cardValue);
  if(cardValue==1){
       this.disabletable=true;
  }
  else{
    this.disabletable=false;
  }
}

//Disable IsDisabld Textfield if not disabled
isDisabled=true;
onClickeDisabled(disValue){
     if(disValue==1){
       this.isDisabled=true;
     }
     else{
       this.isDisabled=false;
     }
}


 userGroup=false;
 groupNameValidation(groupvalue){
   this.log.consoleLog(groupvalue);
   if(groupvalue.toUpperCase()=='STUDENT'){

     this.userGroup=false;
     
              
    }
    else{
      (<FormControl>this.myForm.controls['group_name'])
              .setValue(0, { onlySelf: true });
      this.userGroup=true;
    }
 }



 /**
 * Auto display of district and state and country by selecting taluk
 */

selectedDistrict:any;
selectedState:any;
selectedCountry:any;
onSelectTaluk(talukId){
   this.log.consoleLog(talukId);

   this.taluk.filter((data)=>
   {
     if(data.intTalukId==talukId){
          this.selectedDistrict=data.intDistrictId;
          this.log.consoleLog(this.selectedDistrict);
           (<FormControl>this.myForm.controls['txtDistrict'])
              .setValue(this.selectedDistrict, { onlySelf: true });
     }
    });


   this.district.filter((districtdata)=>{
            if(districtdata.intDistrictId==this.selectedDistrict){
              this.selectedState=districtdata.intStateId;
              this.log.consoleLog("stateid "+this.selectedState);
               (<FormControl>this.myForm.controls['intStateId'])
              .setValue(this.selectedState, { onlySelf: true });
            }
     });


     this.states.filter((ststedata)=>{
            if(ststedata.intStateId==this.selectedState){
              this.selectedCountry=ststedata.intCountryId;
              this.log.consoleLog("country "+this.selectedCountry);
               (<FormControl>this.myForm.controls['txtNationality'])
              .setValue(this.selectedCountry, { onlySelf: true });
            }
     });

}



onSectionEdit(secValue){
  this.log.consoleLog(secValue);
  if(secValue <1){
      
 (<FormControl>this.myForm.controls['intSectionId'])
 .setValue(0, { onlySelf: true });
  }
}
}