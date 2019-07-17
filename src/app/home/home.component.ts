import { Component, OnInit } from "@angular/core";
import { DataService } from "../shared/data.service";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  webViewSrc: string = 'https://testowycgm.herokuapp.com';
  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.reloadData();
  }
}
