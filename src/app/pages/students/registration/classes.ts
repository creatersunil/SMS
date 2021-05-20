export class Classes {
 constructor (
   public class_id:number,
   public class_name:string = ''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Classes (
   json.class_id,
   json.class_name
   
  );
 }

}