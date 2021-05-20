export class OrgStaffType {
 constructor (
   public row_id:string = null,
   public user_id:string = '',
   public comments:string = '',
   public reporting_to:string = '',
   public dt_repoting_start:string = '',
   public dt_reporting_end:string = '',
   public is_active:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new OrgStaffType (
   json.row_id,
   json.user_id,
    json.comments,
   json.reporting_to,
   json.dt_repoting_start,
   json.dt_reporting_end,
   json.is_active
  );
 }

}