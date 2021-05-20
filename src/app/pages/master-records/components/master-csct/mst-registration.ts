export class Registrstiondetails {
 constructor (
   public intRegistrationId:number = null,
   public txtFirstName:string = '',
   public txtLastName:string=''
   //public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Registrstiondetails (
   json.intRegistrationId,
   json.txtFirstName,
   json.txtLastName
  );
 }

}