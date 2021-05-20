export class TeachersList {
    constructor(
        public txtFirstName: string,
        public txtLastName: string = '',
        public intRegistrationId: string = '',

        public skill_name: string = '',
        public skillId: number,
        public row_id: number

    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new TeachersList(
            json.txtFirstName,
            json.txtLastName,
            json.intRegistrationId,
            json.skill_name,
            json.skillid,
            json.row_id
        );
    }

}