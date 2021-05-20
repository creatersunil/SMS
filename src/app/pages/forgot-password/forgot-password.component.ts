import {Component , OnDestroy } from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import {DbService,MessageService,SUCCESS,FAILED } from '../../services';
import 'style-loader!./forgot-password.scss';
import { Router,RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Logs } from '../../services';
import {EmailValidator, EqualPasswordsValidator} from '../../theme/validators';
@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.html',
  providers:[DbService,MessageService]
})
export class ForgotPasswordComponent implements OnDestroy  {

  public form:FormGroup;
  public emailOrPhone:AbstractControl;
  public submitted:boolean = false;

  constructor(fb:FormBuilder,private dbService:DbService,private router:Router,private log:Logs,private messageService: MessageService) {

    this.form = fb.group({
      'emailOrPhone': ['',  Validators.compose([Validators.required])],
    });

   
    this.emailOrPhone = this.form.controls['emailOrPhone'];
 
  }




ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        //this.messageService.clearMessage();
       // this.subscription.unsubscribe();
    }


insertDoc(){
  var doc ={
    'email':this.emailOrPhone.value
  }
  return doc;
}

  public onSubmit():void {
                      this.log.consoleLog(this.emailOrPhone.value.trim());
                      this.log.consoleLog(this.insertDoc());
                      this.dbService.forgotPassword(this.insertDoc()).subscribe((response)=>{
                        this.log.consoleLog(response);

                      });

                       let trigger = this.emailOrPhone.value,
                      numberCheck = new RegExp('^[0-9]\{0,6}$'),
                      stringCheck = new RegExp('^[a-zA-Z]\{0,10}$'),
                      emailCheck = new RegExp('^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})\{0,50}$'),
                      test:any; 
                      this.log.consoleLog(trigger.trim().length);
                      if( test = numberCheck.test(trigger)){

                      }
                    //  this.dbService.
                     
                      this.router.navigate(['/reset-password'])
  
  }
}
