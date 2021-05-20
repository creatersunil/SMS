import {Component , OnDestroy } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
import {DbService,MessageService,SUCCESS,FAILED } from '../../services';
import 'style-loader!./reset-password.scss';
import { Router,RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Logs } from '../../services';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.html',
  providers:[DbService,MessageService]
})
export class ResetPasswordComponent implements OnDestroy  {


ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        //this.messageService.clearMessage();
       // this.subscription.unsubscribe();
    }

 


  public form:FormGroup;
  public code:AbstractControl;
  public email:AbstractControl;
  public password:AbstractControl;
  public repeatPassword:AbstractControl;
  public passwords:FormGroup;

  public submitted:boolean = false;

  constructor(fb:FormBuilder,private dbService:DbService,private router:Router,private log:Logs,private messageService: MessageService) {

    this.form = fb.group({
      'code': ['', Validators.compose([Validators.required, Validators.minLength(32)])],
      'email': ['', Validators.compose([Validators.required, EmailValidator.validate])],
      'passwords': fb.group({
        'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
        'repeatPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
      }, {validator: EqualPasswordsValidator.validate('password', 'repeatPassword')})
    });

    this.code = this.form.controls['code'];
    this.email = this.form.controls['email'];
    this.passwords = <FormGroup> this.form.controls['passwords'];
    this.password = this.passwords.controls['password'];
    this.repeatPassword = this.passwords.controls['repeatPassword'];
  }


   public onSubmit(values:Object):void {
    this.submitted = true;
     this.log.consoleLog(values);
      this.log.consoleLog(this.insertDoc())
      this.dbService.resetPassword(this.insertDoc()).subscribe((response)=>
      {
        this.log.consoleLog(response);
      });
      this.router.navigate(['/login']);
    }

insertDoc(){
  var doc={
    code:this.code.value,
    new_password:this.password.value,
    email:this.email.value
    //code:"work"
    
  }
  return doc;
}

}
