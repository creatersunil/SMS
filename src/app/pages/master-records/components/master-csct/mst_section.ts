export class MstSectionType {
 constructor (
   public section_id:number = null,
   public section_name:string = '',
   //public isActive:string=''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstSectionType (
   json.section_id,
   json.section_name,
   //json.isActive
  );
 }

}