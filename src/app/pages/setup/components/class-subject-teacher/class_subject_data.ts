import {ClassSubject} from '../class_subject';

export class ClassSubjectData {

    constructor(
       
      
        public class_name: string = '',
        public subjects:ClassSubject
        

    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new ClassSubjectData(
            
            json.class_name,
            json.subjects
           


        );
    }

}