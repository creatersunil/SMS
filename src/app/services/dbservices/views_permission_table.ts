
import {Actions } from './view_action_permissions';

export class Views {

    constructor(
        public view_id:string='',
        public view_name:string='',
        public view_actions:Actions
    )
    {}


    static fromJson (json:any) {
		if (!json) return;

		return new Views (
			json.view_id,
			json.view_name,
            Actions.fromJson(json.view_actions)
		 
		);
	}
}
