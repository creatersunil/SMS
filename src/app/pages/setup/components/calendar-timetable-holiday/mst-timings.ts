export class MstTimings {

    constructor(
        public row_id:number,
        public timings:any,
        public name:string=''
        
    ) { }
    static fromJson(json: any) {

        return new MstTimings(
            json.row_id,
            json.timings,
            json.name
            
        );
    }
}
