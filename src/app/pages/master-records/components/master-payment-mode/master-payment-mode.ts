export class PaymentMode {
 constructor (
  
   public mode_id:string = '',
   public mode_name:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new PaymentMode (
   
   json.mode_id,
   json.mode_name
  );
 }

}