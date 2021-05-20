import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserConfig } from '../dbservices';
import { ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class IsAccessible implements CanActivate {

 constructor( private user:UserConfig){}

 canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ) : Observable<boolean>|Promise<boolean>|boolean {
         return this.permissionCheck(route.routeConfig.path);
  }



permissionCheck(viewRoute:any):boolean {

    let isAbleToAccess=false;
  //  console.log("checking access");
    console.log(viewRoute);
    var views = this.user.getAccess();
    views.forEach(element => {              
        if(element.view_name === viewRoute)
        {
           console.log("User has accesss to "+ viewRoute + ' ' + element.view_name);
            isAbleToAccess = true;    
        }
    });    

    return isAbleToAccess;
}


}