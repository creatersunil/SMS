export class RegistrationLoadType {
 constructor (
   public intRegistrationId:number =0,
   public txtFirstName:string = '',
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new RegistrationLoadType (
   json.intRegistrationId,
   json.txtFirstName+ " " + json.txtLastName,
   
  );
 }

}