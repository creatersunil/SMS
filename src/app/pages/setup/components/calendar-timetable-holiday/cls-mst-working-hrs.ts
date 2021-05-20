export class MstWorkingHrs {

    constructor(
        public row_id:any,
        public start_time: any,
        public end_time: any,
        public period_duration: any,
        public lunch: any ,
        public _break: any,

    ) { }
    static fromJson(json: any) {

        return new MstWorkingHrs(
            json.row_id,
            json.start_time,
            json.end_time,
            json.period_duration,
            json.lunch,
            json.break,
        );
    }
}
