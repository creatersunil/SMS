export class HolidayInfo {
 constructor (
   public holiday_id: number = 0,
   public holiday_name:string = '',
   public type_id: number=0,
   public start_Date:string = '',
   public end_Date:string = '',

 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new HolidayInfo (
   json.holiday_id,
   json.holiday_name,
   json.type_id,
   json.start_Date,
   json.end_Date,
  );
 }

}
