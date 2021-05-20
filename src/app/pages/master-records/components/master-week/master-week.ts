export class Week {
 constructor (
   public row_id:string = null,
   public day:string = '',
 
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Week (
   json.row_id,
   json.day,
  
  );
 }

}