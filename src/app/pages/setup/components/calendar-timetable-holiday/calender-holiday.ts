export class CalenderHoliday {

    constructor(
        public start: Date,
        public end: Date,
        public holiday_id: number,
        // public approver_Comments: string = '',
        public year: number,
        public holiday_Desc: string = '',
        public type_id: number,
        public title: string = '',
        public type_name: string = '',
        public color:string='',
        public unique_number

    ) { }
    static fromJson(json: any) {

        return new CalenderHoliday(
            json.start_Date,
            json.end_Date,
            json.holiday_id,
            // json.approver_Comments,
            json.year,
            json.holiday_Desc,
            json.type_id,
            json.holiday_name,
            json.type_name,
            json.event_color,
            json.unique_number
        );
    }
}
