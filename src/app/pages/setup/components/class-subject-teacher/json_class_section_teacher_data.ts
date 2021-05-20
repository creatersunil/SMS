import { ClassSectionTeacher } from './class_section-teacher';

// export class JsonClassSectionTeacher {
//     constructor(

//         public class_name: string = '',
//         public sectionteacher: ClassSectionTeacher,

//     ) { }

//     static fromJson(json: any) {
//         if (!json) return;

//         return new JsonClassSectionTeacher(

//             json.class_name,
//             json.sectionteacher,

//         );
//     }

// }

export class ClassSectionTeacherDataCls {
    constructor(
        public class_name: string = '',
        public sectionteacher:any[],
    ) {

    }
}