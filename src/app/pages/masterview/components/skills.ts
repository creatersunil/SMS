export class Skills {
 constructor (
   public skillId:string = null,
   public skill_name:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Skills (
   json.skillId,
   json.skill_name,
   
  );
 }

}