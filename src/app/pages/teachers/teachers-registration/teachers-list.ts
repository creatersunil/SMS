export class TeachersList {
 constructor (
   public txtFirstName:number,
   public txtLastName:string = '',
   public intRegistrationId:string = '',
   public txtMobileNumber:number,
   public txtEmailId:string = '',
   public dtJoiningDate:string='',
   public txtPerAddress:string='',
   public skill_name:string='',
   public skillId:number,
   public skills:any[] =new Array<TeachersList>(),
   public row_id:number
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new TeachersList (
   json.txtFirstName,
   json.txtLastName,
   json.intRegistrationId,
   json.txtMobileNumber,
   json.txtEmailId,
   json.dtJoiningDate,
   json.txtPerAddress,
   json.skill_name,
   json.skillId,
   json.skills,
   json.row_id
  );
 }

}