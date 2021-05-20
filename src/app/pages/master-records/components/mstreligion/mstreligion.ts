export class MstReligionType {
 constructor (
   public intReligionId:string = null,
   public txtReligionName:string = ''
   //public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstReligionType (
   json.intReligionId,
   json.txtReligionName
  // json.isActive
  );
 }

}