export class AttendanceLeavesTypeList {
 constructor (
   public intLeaveId: number = 0,
   public txtLeaveType:string = '',
   public intNumberOfLeave: number=0,

 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new AttendanceLeavesTypeList (
   json.intLeaveId,
   json.txtLeaveType,
   json.intNumberOfLeave,
  );
 }

}
