export class Religion {
 constructor (
   public intReligionId:string = null,
   public txtReligionName:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Religion (
   json.intReligionId,
   json.txtReligionName,
   
  );
 }

}