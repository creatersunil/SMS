export class GroupView {
 constructor (
   public id:string = null,
   public group_name:string = '',
   public view_name:string='',
   public created_by:string='',
   public edited_by:string='',
   public status:string='',
   public description:string=''
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new GroupView (
   json.id,
   json.group_name,
   json.view_name,
   json.created_by,
   json.edited_by,
   json.status,
   json.description
  );
 }

}