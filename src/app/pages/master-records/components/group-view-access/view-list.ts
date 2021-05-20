export class ViewList {
 constructor (
   public viewId:string = null,
   public viewName:string = '',
   public Active:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new ViewList (
   json.viewId,
   json.viewName,
   json.Active
  );
 }

}