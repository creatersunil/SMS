export class MstDepartmentType {
 constructor (
   public id:number,
   public dep_name:string = '',
   public dep_head_id:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstDepartmentType (
   json.id,
   json.dep_name,
   json.dep_head_id
  ); 
 }

}