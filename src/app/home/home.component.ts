import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { nightScoutPath } from '~/app/env';
import { DataService } from '../shared/data.service';

@Component({
    selector: 'Home',
    moduleId: module.id,
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    items: Array<any>;

    constructor(public dataService: DataService, public httpClient: HttpClient) {
    }

    ngOnInit(): void {
        this.httpClient
            .get(nightScoutPath + 'treatments.json')
            .subscribe(items => {
                this.dataService.items = (items as any);
                this.dataService.items.forEach(item => item.id = item._id);
            });
    }
}
