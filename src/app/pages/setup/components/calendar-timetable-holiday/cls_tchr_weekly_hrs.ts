export class TeacherWeeklyHrs {

    constructor(
        public id:any,
        public name: any,
        public hours: any,

    ) { }
    static fromJson(json: any) {

        return new TeacherWeeklyHrs(
            json.reg_id,
            json.teacher_name,
            json.hours,

        );
    }
}
