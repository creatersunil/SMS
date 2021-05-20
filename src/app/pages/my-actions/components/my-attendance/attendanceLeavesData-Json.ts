export class AttendanceLeaveInfo {
  constructor(
    public intRegistrationId: number,
    public start: string = '',
    public end: string = '',
    public color: string = '',
    public title: string = '',
   // public overlap: boolean,
    //public rendering: string = '',
  ) { }

}
