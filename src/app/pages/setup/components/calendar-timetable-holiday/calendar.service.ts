import { Injectable } from '@angular/core';

import { BaThemeConfigProvider } from '../../../../theme';
import { DbService } from '../../../../services';

@Injectable()
export class CalendarService {
  date: string;
  constructor(private _baConfig: BaThemeConfigProvider, private dbService: DbService) {
    this.dbService.getDateTime('getDate').subscribe((date) => {
      this.date = date;
    });
  }

  getData(calHolData) {

    let dashboardColors = this._baConfig.get().colors.dashboard;
    return {
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },

      defaultDate: this.date,
      selectable: true,
      selectHelper: true,
      editable: true,
      eventLimit: true,
      events: calHolData,
    };
  }
}
