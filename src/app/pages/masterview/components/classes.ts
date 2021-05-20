export class Classes {
 constructor (
   public class_id:string = null,
   public class_Name:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Classes (
   json.class_id,
   json.class_name,
   
  );
 }

}