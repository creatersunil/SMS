export class TeacherSkilldetails {
    constructor(
        public row_id:number,
        public intRegistrationId: number,
        public sub_code: number,
        public skill_name: string = ''

    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new TeacherSkilldetails(
            json.row_id,
            json.intRegistrationId,
            json.sub_code,
            json.skill_name

        );
    }

}