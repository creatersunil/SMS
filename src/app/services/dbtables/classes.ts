export class Classes {
 constructor (
   public class_id:number,
   public class_name:string = '',
   public class_enabled: boolean,
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Classes (
   json.class_id,
   json.class_name,
   json.class_enabled
   
  );
 }

}