export class FeeTypeDetails {
 constructor (
  
   public fee_type:string = '',
   public fee_name:string='',
   public year:string='',
   public created_date:string='',
   public is_active:string='',
   public fees_ref_id:string=''
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new FeeTypeDetails (
  
   json.fee_type,
   json.fee_name,
   json.year,
   json.created_date,
   json.is_active,
   json.fees_ref_id
  );
 }

}