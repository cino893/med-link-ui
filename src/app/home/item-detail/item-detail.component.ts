import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DataService, IDataItem } from "../../shared/data.service";

@Component({
  selector: "ItemDetail",
  moduleId: module.id,
  templateUrl: "./item-detail.component.html"
})
export class ItemDetailComponent implements OnInit {
  item: IDataItem;

  constructor(
    private _data: DataService,
    private _route: ActivatedRoute,
    private _routerExtensions: RouterExtensions
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.params.id;
    this.item = this._data.getItem(id);
    this.item.created_at = new Date(this.item.created_at).toLocaleDateString(
      "pl-PL"
    );
  }

  onBackTap(): void {
    this._routerExtensions.back();
  }
}
