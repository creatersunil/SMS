export class GroupName {
 constructor (
   public id:string = null,
   public group_name:string = '',
  
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new GroupName (
   json.id,
   json.group_name,
   
  );
 }

}