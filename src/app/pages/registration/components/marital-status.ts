export class MaritalStatus {
 constructor (
   public intMaritalStatusId:string = null,
   public txtMaritalStatus:string = ''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new MaritalStatus (
   json.intMaritalStatusId,
   json.txtMaritalStatus
   
  );
 }

}