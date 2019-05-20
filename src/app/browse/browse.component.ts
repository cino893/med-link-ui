import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DataFacadeService } from "~/app/shared/data-facade.service";
import { RawDataService } from "~/app/shared/raw-data-parse.service";

@Component({
  selector: "Browse",
  moduleId: module.id,
  templateUrl: "./browse.component.html"
})
export class BrowseComponent implements OnInit {
  targetBluDeviceUUID = "";
  text = "";
  output = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService
  ) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
  }
}
