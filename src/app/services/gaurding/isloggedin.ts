import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserConfig } from '../dbservices';

@Injectable()
export class LoggedIn implements CanActivate {

    constructor( private user:UserConfig){}

   canActivate(){

    if(this.user.getSession()!=null)
    return true;
    else
    return false;
   } 



}