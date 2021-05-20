export class SocialCatagory {
 constructor (
   public intSocialCategoryId:string = null,
   public txtSocialCategory:string = ''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new SocialCatagory (
   json.intSocialCategoryId,
   json.txtSocialCategory
   
  );
 }

}