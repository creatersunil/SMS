export class Country {
 constructor (
   public intCountryId:string = null,
   public txtCountryName:string = ''
   
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Country (
   json.intCountryId,
   json.txtCountryName
 
  );
 }

}