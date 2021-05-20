export class MstExamNames{
    constructor(
        public intTermId:number,
        public txtTermName:string='',
    ){}

    static fromJson (json:any){
        if(!json) return;

        return new MstExamNames(
            json.intTermId,
            json.txtTermName
        )
    }
}