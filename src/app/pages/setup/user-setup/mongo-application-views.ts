export class ApplicationViews {
    constructor(
        public _id:any,
        public view_id:number,
        public view_name:string='',
        public view_actions:any=[],
    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new ApplicationViews(
            json._id,
            json.view_id,
            json.view_name,
            json.view_actions
        );
    }
}
