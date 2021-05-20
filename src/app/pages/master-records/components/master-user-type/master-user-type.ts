export class UserType {
 constructor (
   //public id:string = null,
   public user_type:string = '',
   public type_id:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new UserType (
  // json.id,
   json.user_type,
   json.type_id
  );
 }

}