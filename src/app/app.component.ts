import { Component, OnInit } from '@angular/core';
import { EventData } from 'tns-core-modules/data/observable';
import { isAndroid } from 'tns-core-modules/platform';
import { DataService } from '~/app/shared/data.service';

@Component({
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: 'app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(public dataService: DataService) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    getIconSource(icon: string): string {
        const iconPrefix = isAndroid ? 'res://' : 'res://tabIcons/';

        return iconPrefix + icon;
    }

    onSelectedIndexChanged(event: EventData & { oldIndex: number, newIndex: number }) {
        if (event.newIndex === 0) {
            this.dataService.reloadData();
        }
    }
}
