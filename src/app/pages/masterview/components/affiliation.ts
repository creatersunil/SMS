export class Affiliation {
 constructor (
   public intAffiliationId:string = null,
   public txtAffiliation:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Affiliation (
   json.intAffiliationId,
   json.txtAffiliation,
   
  );
 }

}