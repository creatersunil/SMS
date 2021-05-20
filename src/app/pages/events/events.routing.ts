import { MyEventsComponent } from './components/my-events/my-events.component';
import { UpcomingEventsComponent } from './components/upcoming-events/upcoming-events.component';
import { NewEventComponent } from './components/new-event/new-event.component';
import { EventsComponent } from './events.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent,
    children: [
      {
        path: 'new-event', component: NewEventComponent
      },
      {
        path: 'upcoming-events', component: UpcomingEventsComponent
      },
      {
        path: 'my-events', component: MyEventsComponent
      }
    ]
  }
];

export const EventsRoutes = RouterModule.forChild(routes);
