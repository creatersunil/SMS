export class Leaves {
 constructor (
   public intLeaveId:string = null,
   public txtLeaveType:string = '',
   public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new Leaves (
   json.intLeaveId,
   json.txtLeaveType,
   json.isActive
  );
 }

}