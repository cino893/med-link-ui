import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { nightScoutPath } from "~/app/env";

export interface IDataItem {
  id: string;
  device: string;
  date: string;
  direction: string;
  sgv: number;
}

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  items = [];

  reloadData() {
    this.httpClient.get(nightScoutPath + "entries.json").subscribe(items => {
      this.items = items as any;
      this.items.forEach(item => (item.id = item.sgv));
    });
  }

  getItem(id: string) {
    return this.items.filter(item => item.id === id)[0];
  }
}
