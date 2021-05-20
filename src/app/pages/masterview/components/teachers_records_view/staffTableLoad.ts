export class StaffLoadType {
 constructor (
   public intRegistrationId:number =0,
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new StaffLoadType (
   json.intRegistrationId,
   
  );
 }

}