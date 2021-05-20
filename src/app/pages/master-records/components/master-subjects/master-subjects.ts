export class Subjects {
 constructor (
   public subject_id:string = null,
   public subject_name:string = '',
   public sub_code:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Subjects (
   json.subject_id,
   json.subject_name,
   json.sub_code
  );
 }

}