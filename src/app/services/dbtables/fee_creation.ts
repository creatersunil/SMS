export class FeeCreation {

    constructor(
        public fee_name: string = '',
        public fees_ref_id: string = '',
        public class_id: string = '',
        public yearlyFees: number = 0,
        public monthlyFee: number = 0,
        public fee_collectable_id: number,
        public insertNumber: number,
        public is_active:boolean,

    ) { }
    static fromJson(json: any) {
        if (!json) return;

        return new FeeCreation(
            json.fee_name,
            json.fees_ref_id,
            json.class_id,
            json.yearlyFees,
            json.monthlyFee,
            json.fee_collectable_id,
            json.insertNumber,
            json.is_active
        );
    }
}
