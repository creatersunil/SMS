export class MstClassType {
 constructor (
   
   public class_id:number = null,
   public class_name:string = '',
   //public isActive:string=''
   
 ) { }

static fromJson (json:any) {
  if (!json) return;

  return new MstClassType (
  
   json.class_id,
   json.class_name,
   //json.isActive
  );
 }

}