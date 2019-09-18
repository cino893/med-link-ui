import { Component, OnInit } from "@angular/core";
import { EventData } from "tns-core-modules/data/observable";
import { isAndroid } from "tns-core-modules/platform";
import { DataService } from "~/app/shared/data.service";
import { TraceWriterService } from "~/app/shared/trace-writer.service";
import { DatabaseService } from "~/app/shared/database.service";

import { compose } from "nativescript-email";

@Component({
  selector: "ns-app",
  moduleId: module.id,
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  constructor(
    public dataService: DataService,
    public traceWriterService: TraceWriterService,
    public databaseService: DatabaseService
  ) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    this.traceWriterService.subscribe(
      ({ message, date, category, messageType }) => {
        this.databaseService.insertLogs(date, message, messageType, category);
      }
    );
  }

  sendLogs() {
    this.databaseService.getLogs().subscribe(a => {
      const aMaped = a.map(b => {
        return b.reduce((prev, next) => prev + next, "");
      });

      const aReduced = aMaped.reduce(b => b + "\r\n", "");

      compose({
        subject: "Debug med-link-ui",
        body: aReduced,
        to: ["jrkf@o2.pl"]
      });
    });
  }

  getIconSource(icon: string): string {
    const iconPrefix = isAndroid ? "res://" : "res://tabIcons/";

    return iconPrefix + icon;
  }

  onSelectedIndexChanged(
    event: EventData & { oldIndex: number; newIndex: number }
  ) {
    if (event.newIndex === 0) {
      this.dataService.reloadData();
    }
  }
}
