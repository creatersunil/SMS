import { ClassSectionData } from './class_section';

export class ClassSectionDataImplementation {
    constructor(

        public class_name: string = '',
        public total_strength: number,
        public no_of_sections: number,
        public sections: ClassSectionData,

    ) { }

    static fromJson(json: any) {
        if (!json) return;

        return new ClassSectionDataImplementation(

            json.class_name,
            json.total_strength,
            json.no_of_sections,
            json.sections,

        );
    }

}
