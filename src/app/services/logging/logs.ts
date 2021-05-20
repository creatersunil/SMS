import { Injectable } from '@angular/core';

@Injectable()
export class Logs
{

logConsole=true;
logDb=false;

/**
 * pass any value similar to console.log("")
 * @param msg 
 */
consoleLog(msg:any) {

    if(this.logConsole)
    console.log(msg);
}




}