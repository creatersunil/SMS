export class MstWeekDays {

    constructor(
        public day: string,
        public working: any,

    ) { }
    static fromJson(json: any) {

        return new MstWeekDays(
            json.day,
            json.working,

        );
    }
}
