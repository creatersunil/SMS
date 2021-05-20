export class Districts {
 constructor (
   public intDistrictId:number = 0,
   public txtDistrictName:string = '',
   public intStateId:number=0,
   
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Districts (
   json.intDistrictId,
   json.txtDistrictName,
   json.intStateId,
   
  );
 }

}