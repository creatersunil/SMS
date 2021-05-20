

export class ClassSectionTeacher {
    constructor(
        public row_id:number,
        public class_id: string = '',
        public class_name:string='',
        public teacher_id:number,
        public section_id:number,
        public section_name:string='',
        public std_count:number,
        public remarks:string='',
        public txtFirstName:string='',
        public txtLastName:string='',
        public unique_num:number
    ) { }

static fromJson(json: any) {
        if (!json) return;

return new ClassSectionTeacher(
            json.row_id,
            json.class_id,
            json.class_name,
            json.teacher_id,
            json.section_id,
            json.section_name,
            json.std_count,
            json.remarks,
            json.txtFirstName,
            json.txtLastName,
            json.unique_num
);
}

}