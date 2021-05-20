import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, Renderer, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalDataSource } from 'ng2-smart-table';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { NgUploaderOptions } from 'ngx-uploader';


//import classes
import { DbService, Logs, UserConfig } from '../../../../services';
import { UtilsService } from '../../../../utils/utils.service';
import { SchoolData } from '../school-data';
import { Classes, Subjects } from '../../../../services';
// import { Subjects } from '../../../../services';


@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./baPictureUploader.scss'],
  providers: [DbService, Logs, UserConfig, UtilsService]
})
export class SchoolComponent implements OnInit {



  editMode: boolean = false;
  myForm: FormGroup;
  schoolData = [];
  classes = [];
  subjects = [];
  classData: any;
  loginId: any;

  public class_enabled: AbstractControl;
  public subject_enabled: AbstractControl;
  public school_Name: AbstractControl;
  public school_Address: AbstractControl;
  public school_Phone: AbstractControl;
  public school_Email: AbstractControl;
  public school_fax: AbstractControl;
  public school_image: AbstractControl;
  public school_Id: AbstractControl;


  constructor(private formBuilder: FormBuilder, private router: Router,
    private log: Logs, private userConfig: UserConfig,
    private dbService: DbService, private renderer: Renderer,
    private utilsService: UtilsService) {
    this.onLoadSchoolData();
    this.myForm = this.formBuilder.group({
      'school_Id': [''],
      'school_Name': [''],
      'school_Address': [''],
      'school_Phone': [''],
      'school_Email': [''],
      'school_fax': [''],
      'school_image': [''],
    });
    this.school_Id = this.myForm.controls['school_Id'];
    this.school_Name = this.myForm.controls['school_Name'];
    this.school_Address = this.myForm.controls['school_Address'];
    this.school_Phone = this.myForm.controls['school_Phone'];
    this.school_Email = this.myForm.controls['school_Email'];
    this.school_fax = this.myForm.controls['school_fax'];
    this.school_image = this.myForm.controls['school_image'];
  }



  ngOnInit() {
    this.loginId = this.userConfig.getRegId();
    this.onLoadClasses();
    this.onLoadSubjects();
  }

  bindData() {
    (<FormControl>this.myForm.controls['school_Id'])
      .setValue(this.schoolFormData.school_Id, { onlySelf: true });
    (<FormControl>this.myForm.controls['school_Name'])
      .setValue(this.schoolFormData.school_Name, { onlySelf: true });
    (<FormControl>this.myForm.controls['school_Address'])
      .setValue(this.schoolFormData.school_Address, { onlySelf: true });
    (<FormControl>this.myForm.controls['school_Phone'])
      .setValue(this.schoolFormData.school_Phone, { onlySelf: true });
    (<FormControl>this.myForm.controls['school_Email'])
      .setValue(this.schoolFormData.school_Email, { onlySelf: true });
    (<FormControl>this.myForm.controls['school_fax'])
      .setValue(this.schoolFormData.school_fax, { onlySelf: true });
    (<FormControl>this.myForm.controls['school_image'])
      .setValue(this.schoolFormData.school_image, { onlySelf: true });
  }



  onClickEditBtn() {
    this.editMode = true;
  }


  /**
   * Save data to data base
   */
  onClickSaveBtn() {
    this.editMode = false;
    this.log.consoleLog(JSON.stringify(this.myForm.getRawValue()));

    var queryFilters = new URLSearchParams();

    /**
     * to check wheater old data and newly edited data is same or not
     */
    if (JSON.stringify(this.myForm.getRawValue()) == JSON.stringify(this.schoolFormData)) {
      this.log.consoleLog('ok');
    }
    else {
      queryFilters.set('filter', 'school_Id= ' + this.schoolData[0].school_Id);
      this.dbService.update('school', (this.myForm.getRawValue()), queryFilters).subscribe((data) => {
        this.log.consoleLog(data);
      });
    }


    if (this.uniqueArrayClass.length > 0) {
      this.log.consoleLog(JSON.stringify(this.uniqueArrayClass));
      // added by suhas
      this.dbService.update('mst_classes', this.uniqueArrayClass, '').subscribe((data) => {

        this.log.consoleLog(data);
        this.uniqueArrayClass = null;
      });
    }

    if (this.uniqueArraySubjects.length > 0) {
      this.dbService.update('mst_subjects', this.uniqueArraySubjects, '').subscribe((data) => {

        this.log.consoleLog(data);
        this.uniqueArraySubjects = null;
      });
    }
  }


  /**
   * 
   * @param sub to add new subject
   */
  onAddSubject(sub) {
    if (sub.toUpperCase().trim().length == 0) {
      this.log.consoleLog("empty")
    }
    else {
      this.log.consoleLog(sub);
      this.log.consoleLog(this.subjectToInsertSkill(sub));
      this.dbService.insert('mst_skills', this.subjectToInsertSkill(sub)).subscribe((data) => {
        this.log.consoleLog(data);
        if (data.resource.length > 0) {
          this.dbService.insert('mst_subjects', this.subjectToInsertSubject(sub, data.resource[0].skillId)).subscribe((subdata) => {
            this.log.consoleLog(subdata);
            this.log.consoleLog(subdata.resource[0].subject_id);
            this.subjects.push(new Subjects(subdata.resource[0].subject_id, sub, false))
          })
        }

      });
    }
  }

  /**
   * 
   * @param event to check wheather checkbox checked or not
   * @param data class data of the corresponding checkbox
   */
  // classChangeData = [];
  uniqueArrayClass = [];
  onClassChange(event, data) {


    this.log.consoleLog(data);

    this.uniqueArrayClass.push(data);
    this.uniqueArrayClass = this.utilsService.removeDulpicates(this.uniqueArrayClass, 'class_id');


    // this.uniqueArrayClass = this.classChangeData.filter((elem, index, self) => {
    //   return index == self.indexOf(elem);
    // });
    // this.uniqueArrayClass = this.utilsService.removeDulpicates(this.classChangeData, 'class_id');

    // this.log.consoleLog(this.uniqueArrayClass);
    for (var i = 0; i < this.staticClassArray.length; i++) {
      if (JSON.stringify(data) == JSON.stringify(this.staticClassArray[i])) {
        this.log.consoleLog("OK");
        this.uniqueArrayClass.splice(this.uniqueArrayClass.indexOf(data), 1);

      }
    }
    this.log.consoleLog(this.uniqueArrayClass);

  }

  /**
   * 
   * @param event to check wheather checkbox checked or not
   * @param data subject data of the corresponding checkbox
   */
  subVar = [];
  uniqueArraySubjects = [];
  // subjectChangedData = [];
  onSubjectChanged(event, data) {

    this.uniqueArraySubjects.push(data);
    this.uniqueArraySubjects = this.utilsService.removeDulpicates(this.uniqueArraySubjects, 'subject_id');
    // this.uniqueArraySubjects = this.subjectChangedData.filter((elem, index, self) => {
    //   return index == self.indexOf(elem);
    // });
    // this.uniqueArraySubjects=this.utilsService.removeDulpicates(this.subjectChangedData,'subject_id')

    // this.log.consoleLog(JSON.stringify(data));
    // this.log.consoleLog(JSON.stringify(this.subjects[0]));
    // this.log.consoleLog(this.subVar[0]);

    for (var i = 0; i < this.subVar.length; i++) {
      if (JSON.stringify(data) == JSON.stringify(this.subVar[i])) {
        this.log.consoleLog("OK");
        this.uniqueArraySubjects.splice(this.uniqueArraySubjects.indexOf(data), 1);

      }
    }
    this.log.consoleLog(this.uniqueArraySubjects);
  }

  /**
   * 
   * @param _subject_name: document to insert data to database mst_skills
   */
  subjectToInsertSkill(_skillName) {
    var doc = {
      skill_name: _skillName,
      created_by: this.loginId
    }
    return doc;
  }


  subjectToInsertSubject(_subject_name, id) {
    var doc = {
      subject_id: id,
      subject_name: _subject_name,
      created_by: this.loginId
    }
    return doc;
  }
  /**
   * on click cancel erase all the data stored in arrays
   */
  onClickCancelBtn() {
    this.editMode = false;
    this.uniqueArrayClass = null;
    this.uniqueArraySubjects = null;
    this.log.consoleLog(this.uniqueArrayClass);
    this.subjects = this.subVar;
    this.classes = this.staticClassArray;
    this.staticClassArray = null;
    this.subVar = null;
  }




  schoolFormData: any;
  onLoadSchoolData() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'school_Id,school_Name,school_Address,school_Phone,school_Email,school_fax,school_image');
    this.schoolData = [];
    this.dbService.query('school', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((schoolData) => {
        this.schoolData.push(SchoolData.fromJson(schoolData));
        this.schoolFormData = SchoolData.fromJson(schoolData)
      });
      this.log.consoleLog(this.schoolData);
      this.log.consoleLog(this.schoolData[0].school_Id);

      this.log.consoleLog(this.schoolFormData);
      this.bindData();
    });


  }

  staticClassArray = [];
  onLoadClasses() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'class_id,class_name,class_enabled');

    this.dbService.query('mst_classes', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));

      });
      data.resource.forEach((classes) => {
        this.staticClassArray.push(Classes.fromJson(classes));

      });

    })
    this.log.consoleLog(this.classes);
  }

  onLoadSubjects() {
    var queryFilters = new URLSearchParams();
    queryFilters.set('fields', 'subject_id,subject_name,subject_enabled');
    this.schoolData = [];
    this.dbService.query('mst_subjects', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((subjects) => {
        this.subjects.push(Subjects.fromJson(subjects));

      });
      data.resource.forEach((subjects) => {
        this.subVar.push(Subjects.fromJson(subjects));

      });
    });
    this.log.consoleLog(this.subjects);
    // this.subVar=this.subjects;
  }


  // public defaultPicture = 'assets/img/theme/no-photo.png';
  // public profile:any = {
  //   picture: 'assets/img/app/profile/Nasta.png'
  // };
  // public uploaderOptions:NgUploaderOptions = {
  //   // url: 'http://website.com/upload'
  //   url: '',
  // };

  @Input() defaultPicture: string = '';
  @Input() picture: string = 'https://www.w3schools.com/css/img_fjords.jpg';

  @Input() uploaderOptions: NgUploaderOptions = { url: '' };
  @Input() canDelete: boolean = true;

  @Output() onUpload = new EventEmitter<any>();
  @Output() onUploadCompleted = new EventEmitter<any>();

  @ViewChild('fileUpload') public _fileUpload: ElementRef;

  public uploadInProgress: boolean;



  beforeUpload(uploadingFile): void {
    let files = this._fileUpload.nativeElement.files;

    if (files.length) {
      const file = files[0];
      this._changePicture(file);

      if (!this._canUploadOnServer()) {
        uploadingFile.setAbort();
      } else {
        this.uploadInProgress = true;
      }
    }
  }

  bringFileSelector(): boolean {
    this.log.consoleLog("Ok")
    this.renderer.invokeElementMethod(this._fileUpload.nativeElement, 'click');
    return false;
  }

  removePicture(): boolean {
    this.picture = '';
    return false;
  }

  _changePicture(file: File): void {
    const reader = new FileReader();
    reader.addEventListener('load', (event: Event) => {
      this.picture = (<any>event.target).result;

    }, false);
    reader.readAsDataURL(file);
    this.log.consoleLog(file);
  }

  _onUpload(data): void {
    if (data['done'] || data['abort'] || data['error']) {
      this._onUploadCompleted(data);
    } else {
      this.onUpload.emit(data);
    }
  }

  _onUploadCompleted(data): void {
    this.uploadInProgress = false;
    this.onUploadCompleted.emit(data);
    //this.log.consoleLog(data);
  }

  _canUploadOnServer(): boolean {
    return !!this.uploaderOptions['url'];
  }





  // // file
  // fileChange(event) {
  //   //this.log.consoleLog(event.target.value)
  //   let fileList: FileList = event.target.files;
  //   if (fileList.length > 0) {
  //     let file: File = fileList[0];
  //     let formData: FormData = new FormData();
  //     formData.append('uploadFile', file, file.name);
  //     this.log.consoleLog(formData);
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'multipart/form-data');
  //     headers.append('Accept', 'application/json');
  //     let options = new RequestOptions({ headers: headers });
  //     // this.http.post(`${this.apiEndPoint}`, formData, options)
  //     //     .map(res => res.json())
  //     //     .catch(error => Observable.throw(error))
  //     //     .subscribe(
  //     //         data => console.log('success'),
  //     //         error => console.log(error)
  //     //     )
  //   }
  // }
}
