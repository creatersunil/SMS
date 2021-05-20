export class SubjectWeeklyHrs {

    constructor(
        public id:any,
        public name: any,
        public hours: any,

    ) { }
    static fromJson(json: any) {

        return new SubjectWeeklyHrs(
            json.subject_id,
            json.subject_name,
            json.hours,

        );
    }
}
