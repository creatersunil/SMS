import { UserConfig } from './../../../../services/dbservices/user.configs';
import { URLSearchParams } from '@angular/http';
import { Logs } from './../../../../services/logging/logs';
import { Router } from '@angular/router';
import { DbService } from './../../../../services/dbservices/db.service';
import { EventDetails } from './../../event-details';
import { Sections } from './../../sections';
import { Classes } from './../../classes';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss'],
  providers: [DbService, Logs, UserConfig]
})
export class MyEventsComponent implements OnInit {

  public classes: any[] = new Array<Classes>();
  public sections: any[] = new Array<Sections>();
  public selectedClass: string;
  public selectedClassId: number;
  public selectedSection: string;
  public selectedSectionId: number;
  public eventDetails: any[] = new Array<EventDetails>();

  constructor(private m_dbService: DbService, private m_router: Router, private m_log: Logs, private m_userConfig: UserConfig) { }

  ngOnInit() {
    this.loadDropdowns();
    this.loadLoggedInUserEvents();
  }

  /**
   * Loads all the events present in the database.
   */
  loadLoggedInUserEvents() {

    var queryFilters = new URLSearchParams();
    queryFilters.set('filter', 'created_By_ID=' + this.m_userConfig.getRegId());
    this.m_dbService.query('event_table', '', queryFilters).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((eventDetails) => {
        this.eventDetails.push(EventDetails.fromJson(eventDetails));
      });
    });
  }

  /**
   * Navigates to the new Events page.
   */
  go2NewEvent() {
    this.m_router.navigate(['/pages/events/new-event']);
  }

  /**
   * Loads the classes and selection dropdown.
   */
  loadDropdowns() {
    //loading the classes from database
    var classFilter = new URLSearchParams();
    classFilter.set('fields', 'class_id,class_name');
    this.m_dbService.query('mst_classes', '', classFilter).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((classes) => {
        this.classes.push(Classes.fromJson(classes));
        this.m_log.consoleLog(this.classes.length);
      });
      this.onSelectClass(this.selectedClassId);
    });

    //loading sections from database
    var sectionFilter = new URLSearchParams();
    sectionFilter.set('fields', 'section_id,section_name');
    this.m_dbService.query('mst_sections', '', sectionFilter).subscribe((result) => {
      var data: any = result.json();
      data.resource.forEach((sections) => {
        this.sections.push(Sections.fromJson(sections));
      });
      this.onSelectSection(this.selectedSectionId);
    });
  }

  /**
   * Sets the selected class based on the selected classId.
   * @param _classId selected classId
   */
  onSelectClass(_classId) {
    this.selectedClassId = _classId;
    if (_classId > 0) {
      this.classes.filter((viewdata) => {
        if (viewdata.class_id == _classId) {
          this.selectedClass = viewdata.class_name;
        }
      });
    } else {
      this.selectedClass = "";
      this.selectedSection = "";
    }
  }

  /**
   * Sets the selected section based on the selected sectionId.
   * 
   * @param _sectionId 
   */
  onSelectSection(_sectionId) {
    this.selectedSectionId = _sectionId;
    if (_sectionId > 0) {
      this.sections.filter((data) => {
        if (data.section_id == _sectionId) {
          this.selectedSection = data.section_name;
        }
        this.m_log.consoleLog(this.selectedSection);
      });
    }
    else {
      this.selectedSection = "";
    }
  }

  /**
   * Loads the sections based on the selected classId.
   * @param _classId 
   */
  selectSectionWRTClass(_classId) {
    if (_classId > 0) {
      let param = {
        "name": "Class_id",
        "value": _classId
      };
      this.m_dbService.getDataFromProc('selectSectionWRTClass', param).subscribe((result) => {
        {
          this.sections = []
          result.resource.forEach((item) => {
            this.sections.push(Sections.fromJson(item));

          });
        }
      });
      this.m_log.consoleLog(this.sections);
    }
    else {
      this.sections = [];
    }
  }
}
