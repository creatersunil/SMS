import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-students',
  template: `<router-outlet></router-outlet>
     <app-snotify></app-snotify>`,
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
