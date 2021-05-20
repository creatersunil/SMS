export class Taluks {
 constructor (
   public intTalukId:number = 0,
   public txtTalukName:string = '',
   public intDistrictId:number=0,
   
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Taluks (
   json.intTalukId,
   json.txtTalukName,
   json.intDistrictId,
   
  );
 }

}