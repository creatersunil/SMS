export class ReportingList {
 constructor (
  
   public intRegistrationId:number,
   public txtFirstName:string

   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new ReportingList (
   json.intRegistrationId,
   json.txtFirstName
 
  );
 }

}