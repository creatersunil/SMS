export class WorkingDaysInfo {
  constructor(
      
      public class_id: number,
      public section_id: number,
      public type: string,
      public txtName: string,
    public intRegistrationId: number,
    public date: string,
  ) { }

  static fromJson(json: any) {
    if (!json) return;

    return new WorkingDaysInfo(
      json.class_id,
      json.section_id,
      json.type,
      json.txtName,
      json.intRegistrationId,
      json.date,


    );
  }

}