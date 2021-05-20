import { Router } from '@angular/router';
import { Logs } from './../../services/logging/logs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [Logs]
})
export class EventsComponent implements OnInit {

  select: number = 1;

  constructor(private router: Router, private log: Logs) {
  }

  ngOnInit() {
    this.onClickLoadTab(this.select);
  }

  onClickLoadTab(_tabNumber) {
    this.select = _tabNumber;
    if (_tabNumber === 1) {
      this.router.navigate(['/pages/events/upcoming-events']);
    }
    else {
      this.router.navigate(['/pages/events/my-events',]);
    }
  };
}

