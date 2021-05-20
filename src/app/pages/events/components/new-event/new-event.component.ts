import { UserConfig } from './../../../../services/dbservices/user.configs';
import { SnotifyService } from 'ng-snotify';
import { Logs } from './../../../../services/logging/logs';
import { DbService } from './../../../../services/dbservices/db.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.scss'],
  providers: [DbService, Logs, UserConfig]
})
export class NewEventComponent implements OnInit {

  myForm: FormGroup;
  loggedInUserID: number;

  public eventName: AbstractControl;
  public eventClass: AbstractControl;
  public eventSection: AbstractControl;
  public startDate: AbstractControl;
  public endDate: AbstractControl;
  public eventDescription: AbstractControl;
  public daysRequested: AbstractControl;


  constructor(private m_router: Router, private m_formBuilder: FormBuilder, private m_dbService: DbService, private m_log: Logs, private m_notify: SnotifyService, private m_userConfig: UserConfig) {
    this.myForm = this.m_formBuilder.group({
      'eventName': ['', Validators.required],
      'startDate': ['', Validators.required],
      'endDate': ['', Validators.required],
      'eventDescription': ['', Validators.required],
      'eventClass': [''],
      'eventSection': ['']
    });

    this.eventName = this.myForm.controls['eventName'];
    this.eventClass = this.myForm.controls['eventClass'];
    this.eventSection = this.myForm.controls['eventSection'];
    this.startDate = this.myForm.controls['startDate'];
    this.endDate = this.myForm.controls['endDate'];
    this.daysRequested = this.myForm.controls['daysRequested'];
    this.eventDescription = this.myForm.controls['eventDescription'];
  }

  ngOnInit() {
  }

  /**
   * Creates new event and saves to database.
   */
  createEvent() {
    var eventObject = {
      event_Name: this.eventName.value,
      event_Description: this.eventDescription.value,
      start_Date: this.startDate.value,
      end_Date: this.endDate.value,
      created_By_ID: this.m_userConfig.getRegId()
    };

    //Saving the event to the database.
    this.m_dbService.insert('event_table', eventObject).subscribe((data) => {
      if (data.resource.length > 0) {
        this.myForm.reset();
        this.m_notify.success("Success", "Event Created");
        this.goBack2Parent();
      }
      else {
        this.m_notify.error("Error", "Somthing went wrong!!");
      }
    });
  }

  /**
   * Navigates back to events on clicking cancel button.
   */
  goBack2Parent() {
    this.m_router.navigate(['/pages/events/my-events']);
  }
}
