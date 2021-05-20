export class GroupView {
 constructor (
  
   public group_name:string = ''

   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new GroupView (
   json.group_name
 
  );
 }

}