import { ClassSubject } from '../class_subject';

export class ClassSectionData {
    constructor(
        public row_id: number = 0,
        public class_id: number,
        public class_name: string = '',
        public total_strength: number,
        public no_of_sections:number,
        public section_id: number,
        public section_name: string = '',
        public std_count: number,
        public unique_num:number

    ) { }

    static fromJson(json: any) {
        if (!json) return;

        return new ClassSectionData(
            json.row_id,
            json.class_id,
            json.class_name,
            json.total_strength,
            json.no_of_sections,
            json.section_id,
            json.section_name,
            json.std_count,
            json.unique_num

        );
    }

}