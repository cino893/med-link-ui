import { Component, OnInit } from "@angular/core";
import { DataService } from "../shared/data.service";
import { DatabaseService } from '~/app/shared/database.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  //a = 'https://openaps.readthedocs.io/en/latest/docs/While%20You%20Wait%20For%20Gear/nightscout-setup.html';
  webViewSrc: string = 'https://openaps.readthedocs.io/en/latest/docs/While%20You%20Wait%20For%20Gear/nightscout-setup.html';
  constructor(public dataService: DataService,
              public databaseService: DatabaseService ) {}

  ngOnInit(): void {
    //this.dataService.reloadData();
    this.sendDatatoNightscout7().then(() => console.log(this.webViewSrc + "ffffffffffffff111111"));
    this.databaseService.execSQLSuccessMonitor.subscribe(wynik => {
      if (wynik === undefined) {
        this.webViewSrc = 'brak danych';
      }
      else {
        this.webViewSrc = wynik.toString().split(',')[0];
        console.log("444444aaaaaaEEEEEEEEEE" + this.webViewSrc);
      }
    });
  }

  getNSData(): Observable<Array<{ http: string; secret: string; hash: string }>> {
    return this.databaseService.NSconf().pipe(
      map(rows => {
        return rows.map(a => ({
          http: a[0],
          secret: a[1],
          hash: a[2]
        }));
      })
    );
  }
  sendDatatoNightscout7() {
    return new Promise((resolve, reject) => {
      this.getNSData().subscribe(g => {
        g.map(bol => {
          console.log(bol.http.toString() + "66666666666" + bol.secret.toString());
          this.webViewSrc = bol.http.toString();
        });
        console.log("as" + this.webViewSrc);
        resolve(),
          reject();
      });
    });
  }
}
