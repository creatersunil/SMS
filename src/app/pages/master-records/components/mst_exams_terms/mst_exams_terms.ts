export class MstExamsTems {
 constructor (
   public intTermId:number,
   public txtTermName:string = '',
   public intStatus:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstExamsTems (
   json.intTermId,
   json.txtTermName,
   json.intStatus
  );
 }

}