export class Taluk {
 constructor (
   public intTalukId:string = null,
   public txtTalukName:string = '',
   public intDistrictId:number
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Taluk (
   json.intTalukId,
   json.txtTalukName,
   json.intDistrictId
  );
 }

}