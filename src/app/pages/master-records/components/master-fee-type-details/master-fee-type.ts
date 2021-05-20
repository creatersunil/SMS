export class FeesDetails {
 constructor (
   public row_id:string = null,
   public fee_type:string = '',
   public fee_name:string='',
   public created_date:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new FeesDetails (
   json.row_id,
   json.fee_type,
   json.fee_name,
   json.created_date
   
  );
 }

}