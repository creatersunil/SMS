export class AttendanceInfo {
  constructor(
    public intRegistrationId: number,
    public date: string,
  ) { }

  static fromJson(json: any) {
    if (!json) return;

    return new AttendanceInfo(
      json.intRegistrationId,
      json.date,

    );
    
  }

}
