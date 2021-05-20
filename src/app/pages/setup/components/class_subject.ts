export class ClassSubject {
    constructor(
        public row_id:number,
        public class_id: number = null,
        public subject_id: string = '',
        public class_name: string = '',
        public subject_name:string = '',
        public subject_isActive: boolean,
        public unique_num:number,

    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new ClassSubject(
            json.row_id,
            json.class_id,
            json.subject_id,
            json.class_name,
            json.subject_name,
            json.subject_isActive,
            json.unique_num


        );
    }

}