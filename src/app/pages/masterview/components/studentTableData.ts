export class StudentTableDataType {
 constructor (
 public intSectionId:number = 0,
 public intClassId:number = 0,
 public intAffiliationId:number = 0,
 public txtTransferCertificateNo:string = '',
 public dtTransferCertificateDate:string = '',
 public txtPreviousSchoolName:string = '',
 public txtPreviousSchoolAddress:string = '',
 public nmParentsAnnualIncome:string = '',
 public txtStudentCasteCertificateNo:string = '',
 public txtStudentCaste:string = '',
 public txtFathersCasteCertificateNo:string = '',
 public txtFathersCaste:string = '',
 public txtMothersCasteCertificateNo:string = '',
 public txtMothersCaste:string = '',
 public txtStudentEnrollmentNumber:string = '',
 public dtAdmissionDate:string = '',
 public txtFMobileNumber:string = '',
 public txtMMobileNumber:string = '',
 public txtFOtherNumber:string = '',
 public txtMOtherNumber:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new StudentTableDataType (
 json.intSectionId,
 json.intClassId,
 json.intAffiliationId,
 json.txtTransferCertificateNo,
 json.dtTransferCertificateDate,
 json.txtPreviousSchoolName,
 json.txtPreviousSchoolAddress,
 json.nmParentsAnnualIncome,
 json.txtStudentCasteCertificateNo,
 json.txtStudentCaste,
 json.txtFathersCasteCertificateNo,
 json.txtFathersCaste,
 json.txtMothersCasteCertificateNo,
 json.txtMothersCaste,
 json.txtStudentEnrollmentNumber,
 json.dtAdmissionDate,
 json.txtFMobileNumber,
 json.txtMMobileNumber,
 json.txtFOtherNumber,
 json.txtMOtherNumber,
  );
 }

}