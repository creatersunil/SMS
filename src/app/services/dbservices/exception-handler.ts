import { ErrorHandler } from "@angular/core";


export class CustomExceptionHandler implements ErrorHandler {
  

    call(error: any, stackTrace: any = null, reason: any = null) {
        // do something with the exception
       
         if (~[401, 404].indexOf(error.status)) {
            window.location.hash = '/login';
        } else {            
           this.call(error, stackTrace, reason);
        }

        console.log("do something with the exception");
    }

    // I handle the given error.
    public handleError(error: any ): void {
        console.log("error" + error);

    }
    
}
