export class ClassLoadType {
 constructor (
   public class_id:string = null,
   public class_name:string = '',
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new ClassLoadType (
   json.class_id,
   json.class_name,
   
  );
 }

}