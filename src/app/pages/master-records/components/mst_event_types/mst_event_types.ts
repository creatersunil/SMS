export class MstEventType {
 constructor (
  
   public event_type:number = null,
   public event_name:string='',
   public event_description:string='',
   
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstEventType (
   
   json.event_type,
   json.event_name,
   json.event_description
  );
 }

}