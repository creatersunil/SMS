export class StudentsWrtClassSection {
 constructor (
   public intRegistrationId:number,
   public txtFirstName:string = '',
   public txtLastName:string = '',
   public txtFMobileNumber:number,
   public txtEmailId:string = '',
   public txtPerAddress:string=''

   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new StudentsWrtClassSection (
   json.intRegistrationId,
   json.txtFirstName,
   json.txtLastName,
   json.txtFMobileNumber,
   json.txtEmailId,
   json.txtPerAddress,
   
  );
 }

}