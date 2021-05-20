export class Disability {
 constructor (
   public intDisabilityChildId:string = null,
   public txtDisability:string = ''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Disability (
   json.intDisabilityChildId,
   json.txtDisability
   
  );
 }

}