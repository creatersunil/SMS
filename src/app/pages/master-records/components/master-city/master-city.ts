export class Cities {
 constructor (
   public intCityId:string = '',
   public txtCityName:string = '',
   public intStateId:string='intStateId'
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Cities (
   json.intCityId,
   json.txtCityName,
   json.intStateId
  );
 }

}