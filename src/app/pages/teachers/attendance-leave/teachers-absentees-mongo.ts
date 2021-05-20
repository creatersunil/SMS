// export class TeachersAbsenteesListMongo {
//     constructor(
//         private date: string = '',
//         private staffattendance:any[]=[]
//     ) { }
//     static fromJson(json:any){
//         if(!json) return;

//         return  new TeachersAbsenteesListMongo(
//          json.date,
//          json.staffattendance
//         )
//     }
// }

export class TeachersAbsenteesListMongoData {
    constructor(
        private date: string = '',
        private intRegistrationId:number,
        private txtName:string=""
    ) { }
    static fromJson(json:any){
        if(!json) return;

        return  new TeachersAbsenteesListMongoData(
         json.date,
         json.intRegistrationId,
         json.txtName
        )
    }
}