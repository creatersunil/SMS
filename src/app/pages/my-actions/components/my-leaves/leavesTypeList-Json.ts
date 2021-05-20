export class LeavesTypeList {
 constructor (
   public intLeaveId: number = 0,
   public txtLeaveType:string = '',
   public intNumberOfLeave: number=0,

 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new LeavesTypeList (
   json.intLeaveId,
   json.txtLeaveType,
   json.intNumberOfLeave,
  );
 }

}
