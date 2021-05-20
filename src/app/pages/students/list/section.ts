export class Sections {
 constructor (
   public section_id:string = null,
   public section_name:string = ''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Sections (
   json.section_id,
   json.section_name
   
  );
 }

}