import {Component} from '@angular/core';

import {GlobalState} from '../../../global.state';
import {DbService} from '../../../services';
import { Router } from '@angular/router';
@Component({
  selector: 'ba-page-top',
  templateUrl: './baPageTop.html',
  styleUrls: ['./baPageTop.scss'],
  providers:[DbService]
})
export class BaPageTop {

  public isScrolled:boolean = false;
  public isMenuCollapsed:boolean = false;

  constructor(private _state:GlobalState,private db:DbService,private router:Router ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  public toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
    this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);
    return false;
  }

  public scrolledChanged(isScrolled) {
    this.isScrolled = isScrolled;
  }


    signOut(){
        console.log("Logging out");
        this.db.logout(this.router);
  }
}
