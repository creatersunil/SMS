export class StaffTableDataType {
 constructor (
 public txtMobileNumber:number = 0,
 public txtRelativeNumber:number = 0,
 public txtAlternateMobileNumber:number = 0,
 public intMaritalStatusId:number = 0,
 public qualification:number = 0,
 public designation:string = '',
 public skillId:number= 0,
 public txtPreviousSchoolName:string = '',
 public txtPreviousSchoolAddress:string = '',
 public subjects:string = '',
 public experience:number = 0
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new StaffTableDataType (
 json.txtMobileNumber,
 json.txtRelativeNumber,
 json.txtAlternateMobileNumber,
 json.intMaritalStatusId,
 json.qualification,
 json.designation,
 json.skillId,
 json.txtPreviousSchoolName,
 json.txtPreviousSchoolAddress,
 json.subjects,
 json.experience
  );
 }

}