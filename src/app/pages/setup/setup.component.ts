import { Component } from '@angular/core';

@Component({
    selector: 'setup',
    template: `<router-outlet></router-outlet>
    <app-snotify></app-snotify>`
})
export class Setup {

    constructor() {
    }
}
