import { Component, OnInit } from '@angular/core';
import bluetooth = require('nativescript-bluetooth');

@Component({
    selector: 'Browse',
    moduleId: module.id,
    templateUrl: './browse.component.html',
})
export class BrowseComponent implements OnInit {
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        bluetooth.enable();
        bluetooth.startScanning({onDiscovered: (asd) => console.log(asd), skipPermissionCheck: false});
        // Use the "ngOnInit" handler to initialize data for the view.
    }
}
