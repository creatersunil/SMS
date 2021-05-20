export class CSCT {
 constructor (
   public class_id:string = null,
   public section_id:string = '',
   public techer_id:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new CSCT (
   json.class_id,
   json.section_id,
   json.techer_id
  );
 }

}