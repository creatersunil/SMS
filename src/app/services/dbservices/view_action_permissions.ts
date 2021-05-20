export class Actions {

    constructor(
        public canEdit:boolean,
        public canDelete:boolean,
        public canQuery:boolean,
        public canUpdate:boolean,
        public canView:boolean,
        public canSearch:boolean,
        public canViewOnlyMine:boolean
    ){}

   static fromJson (json:any) {
		if (!json) return;

		return new Actions (
			json.canEdit,
			json.canDelete,
            json.canQuery,
            json.canUpdate,
            json.canView,
            json.canSearch,
            json.canViewOnlyMine	 
		);
	}   

}