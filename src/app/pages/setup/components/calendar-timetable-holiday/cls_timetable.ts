/**
 * 
 * This class will represent the mongo db time table strucutre 
 * this class is consider to be a row in mongodb.
 * 
 * Added by Suhas
 * Date : 06/07/2017
 */


export class TimeTable {

    constructor(
        public _id:string,
        public class_id: number,
        public section_id: number,
        public reg_id: number,
        public subject_id: number,

        public approved: any,
        public approved_date: any,
        public approved_by: any,
        public approver_name: any,

        public class_name: any,
        public section_name: any,
        public teacher_name: any,
        public subject_name: any,

        public day_name: any,
        public time_start: any,
        public time_end: any,


    ) { }
    static fromJson(json: any) {

        return new TimeTable(
            json._id,
            json.class_id,
            json.section_id,
            json.reg_id,
            json.subject_id,

            json.approved,
            json.approved_date,
            json.approved_by,
            json.approver_name,

            json.class_name,
            json.section_name,
            json.teacher_name,
            json.subject_name,

            json.day_name,
            json.time_start,
            json.time_end
        );
    }
}
