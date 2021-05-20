
export class ClassStudentsMarksDetailsMongo {
    constructor(
        
        public intRegistrationId: number,
        public txtFirstName:string='',
        public txtLastName:string='',
        public totalMarks:number,
        public totalMaxMarks:number,
        public passFailStatus:string='',
        public marks: any = [],
    ) { }
}

export class StudentMarks {
    constructor(
        public subject_id: number,
        public subject_name: string = '',
        public max_marks: string='',
        public passing_marks: string='',
        public obtained_marks: string='',
        public exam_date: string
    ) {
    }
}

export class StudentsFailedData{
    constructor(
        public intRegistrationId: number,
        public subject_id:number,
        public obtained_marks:string='',
        public passing_marks:number
    ){}
}