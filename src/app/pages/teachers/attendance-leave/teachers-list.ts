export class TeachersList {
    constructor(
        public txtFirstName: number,
        public txtLastName: string = '',
        public intRegistrationId: string = '',
        public class_name: string = '',
        public section_name: string = ''
    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new TeachersList(
            json.txtFirstName,
            json.txtLastName,
            json.intRegistrationId,
            json.class_name,
            json.section_name
        );
    }
};


export class TeachersAttendanceList {
    constructor(
        public txtFirstName: string = '',
        public txtLastName: string = '',
        public intRegistrationId: number,
        // public classTeacherFor: string = '',
        public todayStatus: string = '',
        public leaves: number = 0,
        public absents: number = 0,
        public total: number = 0,
        public class_name: string = '',
        public section_name: string = ''
    ) { }
    static jsonFron(json: any) {
        if (!json) return;

        return new TeachersAttendanceList(
            json.txtFirstName,
            json.txtLastName,
            json.intRegistrationId,
            // json.classTeacherFor,
            json.todayStatus,
            json.leaves,
            json.absents,
            json.total,
            json.class_name,
            json.section_name
        )
    }
}



///////// Teachers on Leave
export class TeachersOnLeave {
    constructor(
        public intRegistrationId: number,
        public txtFirstName: string = '',
        public txtLastName: string = ''
    ) { }

    static fromJson(json: any) {
        if (!json) return;
        return new TeachersOnLeave(
            json.user_id,
            json.txtFirstName,
            json.txtLastName
        )
    }
}