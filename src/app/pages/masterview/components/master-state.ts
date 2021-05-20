export class States {
 constructor (
   public intStateId:string = null,
   public txtStateName:string = '',
   public intCountryId:string='',
   
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new States (
   json.intStateId,
   json.txtStateName,
   json.intCountryId,
   
  );
 }

}