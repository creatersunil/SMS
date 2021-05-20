export class StudentsMarksDetailsMongo{
  constructor(
     public student_id: number,
    public class_id: number,
    public section_id: number,
    public subject_id:number,
    public subject_name:string='',
    public max_marks:number,
    public passing_marks:number,
    public obtained_marks:number,
    public exam_date:string
  ){}
  static fromJson(json:any){
    if(!json) return;

    return new StudentsMarksDetailsMongo(
      json.student_id,
      json.class_id,
      json.section_id,
      json.subject_id,
      json.subject_name,
      json.max_marks,
      json.passing_marks,
      json.obtained_marks,
      json.exam_date
    )
  }
}
