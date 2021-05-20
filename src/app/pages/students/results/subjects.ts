export class Subjects {
 constructor (
   public subject_id:number,
   public subject_name:string = '',
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Subjects (
   json.subject_id,
   json.subject_name,
  );
 }

}
