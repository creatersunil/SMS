export class Subjects {
 constructor (
 public subject_id:number=null,
 public subject_name:string = '',
 public subject_enabled:boolean,
 public class_id:number
  
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Subjects (
   json.subject_id,
   json.subject_name,
   json.subject_enabled,
   json.class_id
  
  );
 }

}