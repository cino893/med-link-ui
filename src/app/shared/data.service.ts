import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { nightScoutPath } from "~/app/env";

export interface IDataItem {
  id: string;
  created_at: string;
  carbs: number;
  insulin: number;
  enteredBy: string;
  reason: string;
}

@Injectable({
  providedIn: "root"
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  items = [];

  reloadData() {
    this.httpClient.get(nightScoutPath + "treatments.json").subscribe(items => {
      this.items = items as any;
      this.items.forEach(item => (item.id = item._id));
    });
  }

  getItem(id: string) {
    return this.items.filter(item => item.id === id)[0];
  }
}
