import { Component, OnInit } from "@angular/core";
import { DataService } from "../shared/data.service";
import { DatabaseService } from '~/app/shared/database.service';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { WebView } from "tns-core-modules/ui/web-view";
import { EventData } from "tns-core-modules/data/observable";
import { isAndroid } from "tns-core-modules/platform";

@Component({
  selector: "Home",
  moduleId: module.id,
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  webViewSrc: string = 'https://openaps.readthedocs.io/en/latest/docs/While%20You%20Wait%20For%20Gear/nightscout-setup.html';
  constructor(public dataService: DataService,
              public databaseService: DatabaseService ) {}

  ngOnInit(): void {
    this.sendDatatoNightscout7().then(() => console.log(this.webViewSrc + "ffffffffffffff111111"));
  }
  onRefresh(){
    this.sendDatatoNightscout7().then(() => console.log(this.webViewSrc + "ffffffffffffff111111"));
  }
  onWebViewLoaded(args: EventData) {
    const webView = args.object as WebView;

    const nativeWebView = webView.nativeView; // equal to webView.android or webView.ios (depending on the platform)

    if (isAndroid) {
      nativeWebView.getSettings().setAppCacheEnabled(true);
      nativeWebView.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_NORMAL);
      nativeWebView.getSettings().setJavaScriptEnabled(true);
      nativeWebView.getSettings().setDomStorageEnabled(true);
      nativeWebView.getSettings().setDatabaseEnabled(true);
      //nativeWebView.getSettings().setDatabasePath(dbpath); //check the documentation for info about dbpath
      nativeWebView.getSettings().setMinimumFontSize(1);
      nativeWebView.getSettings().setMinimumLogicalFontSize(1);
      nativeWebView.setSupportZoom(true);
    }
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
