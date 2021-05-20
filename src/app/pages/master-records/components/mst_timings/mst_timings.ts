export class MstTimingType {
 constructor (
   public row_id:string = null,
   public timings:string = '',
   public period_name:string=''
   //public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstTimingType (
   json.row_id,
   json.timings,
   json.period_name
   //json.isActive
  );
 }

}