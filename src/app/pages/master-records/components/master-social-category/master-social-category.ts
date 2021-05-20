export class SocialCategory {
 constructor (
   public intSocialCategoryId:string = null,
   public txtSocialCategory:string = '',

   
 ) { }



static fromJson (json:any) {
  if (!json) return;

  return new SocialCategory (
   json.intSocialCategoryId,
   json.txtSocialCategory,
   
  );
 }

}