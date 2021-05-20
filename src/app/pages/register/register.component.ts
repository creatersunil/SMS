import {Component} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators,FormControl} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';

import 'style-loader!./register.scss';
import {DbService,UserConfig,Logs} from '../../services';
import { Router,RouterModule } from '@angular/router';
@Component({
  selector: 'register',
  templateUrl: './register.html',
  providers:[DbService,UserConfig,Logs]
})
export class Register {

  public form:FormGroup;
  public first_name:AbstractControl;
  public last_name:AbstractControl;
  public display_name:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  // public repeatPassword:AbstractControl;
  // public passwords:FormGroup;

  public submitted:boolean = false;

  constructor(fb:FormBuilder,private dbService:DbService,private router:Router,private log:Logs,private userconfig:UserConfig) {

    this.form = fb.group({

      'first_name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'last_name': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'display_name':['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],     
      // 'passwords': fb.group({
      //   'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      //   'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      // }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.display_name = this.form.controls['display_name'];
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
    // this.passwords = <FormGroup> this.form.controls['passwords'];
     //this.password = this.password.controls['password'];
    // this.repeatPassword = this.passwords.controls['repeatPassword'];
  
 (<FormControl>this.form.controls['password'])
 .setValue(this.generatePassword(), { onlySelf: true });

  }

  

  toJson (stringify?: boolean):any {
		var doc = {
            email:this.email.value,
			first_name: this.first_name.value,
			last_name: this.last_name.value,
            display_name:this.display_name.value,          
			password: this.password.value,
            code:"work"	,
            school_id:this.userconfig.getSchoolId(),
            school_code:this.userconfig.getSchoolCode()	
		};

       this.log.consoleLog(" Sending " + JSON.stringify(doc));
		return stringify ? JSON.stringify(doc) : doc;
	}


   onSubmit():void {
    this.submitted = true;
   
    if (this.form.valid) {
      this.dbService.register(this.toJson(true));
      // this.dbService.register(this.form.getRawValue()).subscribe((success)=>{
      //   this.log.consoleLog(success);
      // }
      // );
      // your code goes here
      // console.log(values);
    
  }}



 generatePassword():any
 {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 8; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
 }
}
