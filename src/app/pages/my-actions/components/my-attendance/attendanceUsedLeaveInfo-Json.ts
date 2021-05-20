export class AttendanceUsedLeaves {
  constructor(
    public id: number,
    public registrationId: number = 0,
    public leaveId: number = 0,
    public totalLeaves: number = 0,

  ) { }

  static fromJson(json: any) {
    if (!json) return;

    return new AttendanceUsedLeaves(
      json.id,
      json.registrationId,
      json.leaveId,
      json.totalLeaves
    );
  }
}
