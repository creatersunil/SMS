export class MotherTongue {
 constructor (
   public intmothertongueId:string = null,
   public txtmothertongue:string = '',

   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MotherTongue (
   json.intmothertongueId,
   json.txtmothertongue,

  );
 }

}