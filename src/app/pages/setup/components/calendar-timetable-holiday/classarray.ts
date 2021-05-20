import { Component, OnInit, Input, OnDestroy } from '@angular/core';


@Component({
    selector: 'class-array',
    templateUrl: './classarray.html' 
     
})


export class ClassRef /*implements OnInit */{

//public static arr_table_ref=[];

 @Input("ref")ref:string;


//  public constructor(){
//      this.ref ='';
//  }

//  ngOnInit() {   

//     ClassRef.arr_table_ref.push(this.ref);

//  }

// static clear(){

//     if(ClassRef.arr_table_ref.length >0){

//             ClassRef.arr_table_ref.forEach((element)=>{
//                 element.ref='';

//             });

//     }

//  }


}
