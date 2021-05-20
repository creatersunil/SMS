export class StudentLoadType {
 constructor (
   public intRegistrationId:number =0,
   public class_id:string = '',
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new StudentLoadType (
   json.intRegistrationId,
   json.class_id,
   
  );
 }

}