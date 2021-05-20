export class MstDisabilitychildType {
 constructor (
   public intDisabilityChildId:string = null,
   public txtDisability:string = '',
   //public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstDisabilitychildType (
   json.intDisabilityChildId,
   json.txtDisability,
  // json.isActive
  );
 }

}