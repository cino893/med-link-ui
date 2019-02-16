import { Injectable } from '@angular/core';

export interface IDataItem {
    id: string;
    created_at: string;
    carbs: number;
    insulin: number;
    enteredBy: string;
    reason: string
}

@Injectable({
    providedIn: 'root',
})
export class DataService {

    items = [];

    getItem(id: string) {
        return this.items.filter((item) => item.id === id)[0];
    }
}
