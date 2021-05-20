export class MstSkillsType {
 constructor (
   public skillId:number,
   public skill_name:string = ''
   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new MstSkillsType (
   json.skillId,
   json.skill_name
  );
 }

}