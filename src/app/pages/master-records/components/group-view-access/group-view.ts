export class GroupView {
 constructor (
   public id:string = null,
   public group_name:string = '',
   public view_name:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new GroupView (
   json.id,
   json.group_name,
   json.view_name
  );
 }

}