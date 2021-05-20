export class EventDetails {
    constructor(public row_Id: number,
        public event_Name: string = '',
        public event_Description: string = '',
        public created_Date: string = '',
        public start_Date: string = '',
        public end_Date: string = '',
        public status_Track: number,
        public created_By_ID: number,
        public event_Type: string = '',
        public eventClass: string = '',
        public eventSection: string = ''
    ) { }

    static fromJson(json: any) {
        if (!json) return;
        return new EventDetails(
            json.row_Id,
            json.event_Name,
            json.event_Description,
            json.created_Date,
            json.start_Date,
            json.end_Date,
            json.status_Track,
            json.created_By_ID,
            json.event_Type,
            "eventClass",
            "section"
        );
    }
}