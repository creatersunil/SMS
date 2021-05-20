export class Cities {
 constructor (
   public intCityId:string = null,
   public txtCityName:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Cities (
   json.intCityId,
   json.txtCityName,
   
  );
 }

}