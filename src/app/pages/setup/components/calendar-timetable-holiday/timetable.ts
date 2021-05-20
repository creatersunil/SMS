import { Component, OnInit, Input, OnDestroy } from '@angular/core';


@Component({
    selector: 'time-table',
    templateUrl: './timetable.html',
    styleUrls: ['./timetable.css']
})

export class TimeTable implements OnInit, OnDestroy {

    public static arr_time_table =new Array<TimeTable>();   // store insert and updatable time table list
    public static arr_table_ref = new Array<TimeTable>();;  // store only refrence of time table cell.

    public static _UPDATE ='update';                        // static data for reference
    public static _INSERT = 'insert';   

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

      //  this._id='';    
        this.subject_id = 0;
        this.class_id = 0;
        this.section_id = 0;
        this.reg_id = 0;


        //this.day = '';
        this.time_start = '';
        this.time_end = '';

        this.subject_name = '';
        this.teacher_name = '';
        this.class_name = '';
        this.section_name = '';


        this.approved = false;
        this.approved_date = '';
        this.approved_by = '';
        this.approver_name = '';

        this.timetable = null;

    }
    /**
     * clear current cell data. 
     * also need to remove the time table data from array of time tables
     * 
     */
    removeTimeTable() {

       // this._id='';   
        this.subject_name = '';
        this.teacher_name = '';
        this.subject_id = 0;
        this.reg_id = 0;

       // this.day_name = '';
       // this.time_start = '';
       // this.time_end = '';

        this.subject_name = '';
        this.teacher_name = '';
      //  this.class_name = '';
      //  this.section_name = '';


        this.approved = false;
        this.approved_date = '';
        this.approved_by = '';
        this.approver_name = '';


       // this.timetable = null;



    }

    ngOnInit() {    
        
       // console.log("Initiating Timetable ");
        TimeTable.arr_table_ref.push(this.timetable);
    }


    ngOnDestroy() {

        // this.subject_id = 0;
        // this.class_id = 0;
        // this.section_id = 0;
        // this.reg_id = 0;


        // this.day = '';
        // this.start_time = '';
        // this.end_time = '';

        // this.subject_name = '';
        // this.teacher_name = '';
        // this.class_name = '';
        // this.section_name = '';

        
        // this.approved = false,
        // this.approved_date = '',
        // this.approved_by = '',
        // this.approver_name = '',

        // this.mode ='';
        
        // this.timetable = null;
        //  console.log("time table dead");

    }

static  clearBeforeInsert() {
        //  console.log("clearing ref");
        TimeTable.arr_table_ref.forEach((ref) => {
         
       // ref._id='';    
        ref.subject_id = 0;
        ref.class_id = 0;
        ref.section_id = 0;
        ref.reg_id = 0;


        ref.day_name = '';
        ref.time_start = '';
        ref.time_end = '';

        ref.subject_name = '';
        ref.teacher_name = '';
        ref.class_name = '';
        ref.section_name = '';

        
        ref.approved = false;
        ref.approved_date = '';
        ref.approved_by = '';
        ref.approver_name = '';

        ref.mode ='';
        
        ref.timetable = null;
        
        //TimeTable.arr_time_table.splice(TimeTable.arr_time_table.indexOf(ref),1); 
        });
        
        //TimeTable.arr_time_table =[];

    }

  static getTimeTableList(): any {
        //console.log(TimeTable.arr_time_table.length);
        return TimeTable.arr_time_table;
    }

    /**
     * 
     * @param ref 
     * saving time table to an array so that we can use it for database insert and update.
     */

    static addToTimeTableArray(ref:TimeTable){
        
        let isExist = TimeTable.arr_time_table.indexOf(ref);
        console.log("Ref exist "+ isExist);
        if(isExist>=0) {
            TimeTable.arr_time_table.splice(isExist,1);
        }
        TimeTable.arr_time_table.push(ref);

    }

    /**
     *  make a list of time table which has to be inserted to database 
     * 
     */

    static getNewTimeTableList():Array<TimeTable> {
        let _local = new Array<TimeTable>();
        
         TimeTable.arr_time_table.forEach((element)=>{

                if(element.mode!='' && element.mode!=undefined) {

                    if(element.mode == TimeTable._INSERT){
                        delete element._id;
                        delete element.mode;
                        delete element.timetable;
                        
                        _local.push(element);

                    }
                }

         });


        return _local

    }


    /**
     *  get the list of time table which need to be updated. 
     * 
     */

     static getUpdateTimeTableList():Array<TimeTable> {
        let _local = new Array<TimeTable>();
        
         TimeTable.arr_time_table.forEach((element)=>{

                if(element.mode!='' && element.mode!=undefined) {

                    console.log(element._id);   
                    if(element.mode == TimeTable._UPDATE && element._id!=''){
                        delete element.mode;
                        delete element.timetable;

                        _local.push(element);

                    }
                }

         });


        return _local

    }


}