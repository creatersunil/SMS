export class StudentsList {
 constructor (
   public txtFirstName:number,
   public txtLastName:string = '',
   public intRegistrationId:string = '',
   
 ) { }
 static fromJson (json:any) {
  if (!json) return;

  return new StudentsList (
   json.txtFirstName,
   json.txtLastName,
   json.intRegistrationId,
  );
 }
};


export class StudentsAttendanceList {
    constructor(
        public txtFirstName:string='',
        public txtLastName:string='',
        public intRegistrationId:number,
        // public classTeacherFor:string='',
        public todayStatus:string='',
        public leaves:number=0,
        public absents:number=0,
        public total:number=0
    ){}
    static jsonFron(json:any){
        if(!json) return;

        return new StudentsAttendanceList(
            json.txtFirstName,
            json.txtLastName,
            json.intRegistrationId,
            // json.classTeacherFor,
            json.todayStatus,
            json.leaves,
            json.absents,
            json.total
        )
    }
}

export class StudentsOnLeave {
    constructor(
       public intRegistrationId:number,
       public txtFirstName:string='',
       public txtLastName:string=''
    ){}
    static fromJson(json:any){
        if(!json) return;

        return new StudentsOnLeave(
            json.user_id,
            json.txtFirstName,
            json.txtLastName
        )
    }
}