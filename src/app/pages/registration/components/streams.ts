export class Streams {
 constructor (
   public intStreamId:string = null,
   public txtStream:string = ''
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new Streams (
   json.intStreamId,
   json.txtStream
   
  );
 }

}