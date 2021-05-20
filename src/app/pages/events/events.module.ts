import { MyEventsComponent } from './components/my-events/my-events.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewEventComponent } from './components/new-event/new-event.component';
import { DataTableModule } from 'ng2-data-table';
import { NgaModule } from './../../theme/nga.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events.component';
import { EventsRoutes } from './events.routing';

@NgModule({
  imports: [
    CommonModule, EventsRoutes, NgaModule, DataTableModule, FormsModule, ReactiveFormsModule
  ],
  declarations: [EventsComponent, NewEventComponent, UpcomingEventsComponent, MyEventsComponent]
})
export class EventsModule { }