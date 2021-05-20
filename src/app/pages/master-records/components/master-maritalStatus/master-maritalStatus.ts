export class MaritalStatus {
 constructor (
   public intMaritalStatusId:string = '',
   public txtMaritalStatus:string = '',
  
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MaritalStatus (
   json.intMaritalStatusId,
   json.txtMaritalStatus,
 
  );
 }

}