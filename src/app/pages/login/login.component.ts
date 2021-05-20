import { Component, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { DbService, MessageService, SUCCESS, FAILED } from '../../services';
import 'style-loader!./login.scss';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Logs } from '../../services';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  providers: [DbService, MessageService]
})
export class Login implements OnDestroy {

  public form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;
  public isLoginSuccess = true;
  subscription: Subscription;
  private message: any;
  public loading: boolean = false;

  constructor(fb: FormBuilder, private dbService: DbService, private router: Router,
    private log: Logs, private messageService: MessageService) {

    this.subscription = this.messageService.getMessage().subscribe(message => {

      this.message = message;
      this.log.consoleLog('Received message ');
      this.log.consoleLog(this.message);

      if (this.message.text !== null && this.message.text === SUCCESS) {

        // this.subscription.unsubscribe();
        this.isLoginSuccess = true;
        this.loading = false;

      }
      else if (this.message.text !== null && this.message.text === FAILED) {
        this.isLoginSuccess = false;
        this.loading = false;
      }


    });

    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4),
      Validators.pattern('[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})')
      ])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    //this.messageService.clearMessage();
    this.subscription.unsubscribe();
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    this.loading = true;
    // this.isLoginSuccess=null;

    if (this.form.valid) {
      // your code goes here
      // console.log(values);
      this.dbService.login(this.form.getRawValue(), this.router, 'dashboard');
    }
  }
}
