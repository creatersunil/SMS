export class FeesDetails {

    constructor(
        public fee_name: string = '',
        public fees_ref_id: string = '',


    ) { }
    static fromJson(json: any) {

        return new FeesDetails(
            json.fee_name,
            json.fees_ref_id,
        );
    }
}
