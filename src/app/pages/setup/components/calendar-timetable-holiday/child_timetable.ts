import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TimeTable } from './timetable';


@Component({
    selector: 'child-table',
    templateUrl: 'child_timetable.html'
})

export class ChildTimeTable implements OnInit, OnDestroy {

    
    _UPDATE ='update';
    _INSERT = 'insert';

    @Input("_id")_id:string;
    @Input('subject_id') subject_id: number;
    @Input('class_id') class_id: number;
    @Input('section_id') section_id: number;
    @Input('reg_id') reg_id: number;

    @Input('day_name') day_name: string;
    @Input('time_start') time_start: string;
    @Input('time_end') time_end: string;

    @Input('subject_name') subject_name: string;
    @Input('teacher_name') teacher_name: string;
    @Input('class_name') class_name: string;
    @Input('section_name') section_name: string;

    @Input('approved') approved: Boolean;
    @Input('approved_date') approved_date: string;
    @Input('approved_by') approved_by: string;
    @Input('approver_name') approver_name: string;

    @Input('mode') mode: string;

    @Input('timetable') timetable: TimeTable;

    public constructor() {
        this._id=this._id;     
        this.subject_id = 0;
        this.class_id = 0;
        this.section_id = 0;
        this.reg_id = 0;


        this.day_name = '';
        this.time_start = '';
        this.time_end = '';

        this.subject_name = '';
        this.teacher_name = '';
        this.class_name = '';
        this.section_name = '';

        this.approved = false,
        this.approved_date = '',
        this.approved_by = '',
        this.approver_name = '',

        this.mode = this._UPDATE;

        this.timetable = null;


    }




    /**
     * clear current cell data. 
     * also need to remove the time table data from array of time tables
     * 
     */
    removeTimeTable() {
        //this._id='';    
        this.subject_id = 0;
        this.class_id = 0;
        this.section_id = 0;
        this.reg_id = 0;


       // this.day = '';
       // this.start_time = '';
       // this.end_time = '';

        this.subject_name = '';
        this.teacher_name = '';
        this.class_name = '';
        this.section_name = '';

       // this.approved = false,
      //  this.approved_date = '',
       // this.approved_by = '',
      //  this.approver_name = '',

            
        this.timetable = null;

    }


    ngOnInit() {
        console.log(this._id);
        this.timetable._id= this._id;    
        this.timetable.subject_id = this.subject_id;
        this.timetable.class_id = this.class_id;
        this.timetable.section_id = this.section_id;
        this.timetable.reg_id = this.reg_id;


        this.timetable.day_name = this.day_name;
        this.timetable.time_start = this.time_start;
        this.timetable.time_end = this.time_end;

        this.timetable.subject_name = this.subject_name;
        this.timetable.teacher_name = this.teacher_name;
        this.timetable.class_name = this.class_name;
        this.timetable.section_name = this.section_name;

        this.timetable.approved = this.approved;
        this.timetable.approved_by = this.approved_by;
        this.timetable.approved_date = this.approved_date;
        this.timetable.approver_name = this.approver_name;
        
        this.timetable.mode = this.mode;

        this.ngOnDestroy();
    }



    ngOnDestroy() {
       this.removeTimeTable();
    }


}