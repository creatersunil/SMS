export class MstFeeType {
 constructor (
   public id:number = null,
   public fee_type:string = '',
  // public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstFeeType (
   json.id,
   json.fee_type,
  // json.isActive
  );
 }

}