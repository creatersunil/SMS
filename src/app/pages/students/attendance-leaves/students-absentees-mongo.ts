
export class StudentsAbsenteesListMongoData {
    constructor(
        private date: string = '',
        private intRegistrationId: number,
        private txtName: string = ""
    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new StudentsAbsenteesListMongoData(
            json.date,
            json.intRegistrationId,
            json.txtName
        )
    }
}