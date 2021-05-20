export class SchoolData {
 constructor (
   public school_Id:number=null,
   public school_Name:string = '',
   public school_Address:string='',
   public school_Phone:number=null,
   public school_Email:string = '',
   public school_fax:string='',
   public school_image:String=''
  
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new SchoolData (
   json.school_Id,
   json.school_Name,
   json.school_Address,
   json.school_Phone,
   json.school_Email,
   json.school_fax,
   json.school_image

  
  );
 }

}