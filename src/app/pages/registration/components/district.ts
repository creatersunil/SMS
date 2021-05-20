export class District {
 constructor (
   public intDistrictId:string = null,
   public txtDistrictName:string = '',
   public intStateId:string =''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new District (
   json.intDistrictId,
   json.txtDistrictName,
   json.intStateId
  );
 }

}