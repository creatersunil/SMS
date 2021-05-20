export class LeavesInfo {
  constructor(
    public leaveid: number,
    public dtFromDate: string = '',
    public dtToDate: string = '',
    public intLeavetype: number = 0,
    public days_requested: number = 0,
    public intStatus: number = 0,
    public txtLeaveType: string= '',
  ) { }

  static fromJson(json: any) {
    if (!json) return;

    return new LeavesInfo(
      json.leaveid,
      json.dtFromDate,
      json.dtToDate,
      json.intLeavetype,
      json.days_requested,
      json.intStatus,
      json.txtLeaveType,
    );
  }

}
