import { HttpClient } from "@angular/common/http";
import { identifierModuleUrl } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { alert } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { nightScoutPath } from "~/app/env";
import { DatabaseService } from '~/app/shared/database.service';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { sha1 } from 'sha1';

@Component({
  selector: "Search",
  moduleId: module.id,
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  slowo: string;
  slowo2: string;
  nsUrl: string;
  nsUrl2: string;
  nsKey: string;
  nsKey2: string;
  carbs: string;
  pending = false;
  pumpData: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private databaseService: DatabaseService,
              private dataFacadeService: DataFacadeService) {
    // Use the constructor to inject services.
  }
  ngOnInit(): void {
    this.databaseService.execSQLSuccessMonitor.subscribe(wynik => {
      if (wynik === undefined) {
        this.pumpData = 'brak danych';
      }
      else {
        this.pumpData = this.dataFacadeService.btData + 'SQL: ' + wynik;
      }
    });
    this.sendDatatoNightscout7().then(() => console.log(this.nsUrl2 + "fffffffffffff3333333f"));
  }
  Zapisz() {
    console.log("aaaaaa" + this.nsUrl);
    const sha1 = require('sha1');
    this.databaseService.insertNS(this.nsUrl, sha1(this.nsKey), this.nsKey);
    this.pumpData = this.dataFacadeService.btData;
    //this.databaseService.updateNS("adsad", "1231231");
    console.log("NS URL: " + this.nsUrl + ' ddddddddddd ' + this.nsKey);
    this.sendDatatoNightscout6().then(() => console.log(this.slowo + "aRRRRRRRRRR"));
    if (this.nsUrl.substring(0, 8).toUpperCase() !== 'HTTPS://' || this.nsUrl.substring(this.nsUrl.length - 1, this.nsUrl.length) === '/') {
      this.slowo2 = 'ZŁY ADRES URL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!';
    }
    else {
      this.slowo2 = 'OK! ';
    }
  }
  sendDatatoNightscout6() {
    return new Promise((resolve, reject) => {
      this.getNSData().subscribe(g => {
         g.map(bol => {
           console.log(bol.http.toString() + "JJJJJJJ" + bol.secret.toString());
           this.slowo = this.slowo2 + '  ' + bol.http.toString() + ' ' +  bol.secret.toString();
         });
         console.log("as" + this.slowo);
         resolve(),
        reject();
      });
    });
  }
  sendDatatoNightscout7() {
    return new Promise((resolve, reject) => {
      this.getNSData().subscribe(g => {
        g.map(bol => {
          console.log(bol.http.toString() + "66666666666" + bol.secret.toString());
          this.nsUrl2 = bol.http.toString();
          this.nsKey2 = bol.hash.toString();
        });
        console.log("as" + this.nsUrl2);
        resolve(),
          reject();
      });
    });
  }
  checkUrl (nsUrl: string){
    if (this.nsUrl.substring(0, 8).toUpperCase() === 'HTTPS://') {
      this.slowo = 'zly adres';
    }
    console.log(this.slowo + 'TTTTTTTTT');
  }
  setNS(arg) {
    console.log("setttNS");
    console.log(arg.text);
    this.nsUrl = arg.text;
  }
  setNSurl(arg) {
    console.log("setttNSUURRL");
    console.log(arg.text);
    this.nsKey = arg.text;

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

  shouldButtonBeEnabled() {
    return !!this.carbs && !this.pending;
  }

  showFeedBack(success, response) {
    let title;

    if (success) {
      title = "Sukces!";
    } else {
      title = "Błąd!";
    }

    const options = {
      title,
      message: JSON.stringify(response),
      okButtonText: "Przyjąłem do wiadomości"
    };

    alert(options).then(() => this.clearForm());
  }

  clearForm() {
    this.pending = false;
    this.carbs = "";
  }

  runChangeDetection() {
    this.changeDetectorRef.detectChanges();
  }

  changeText(textfield) {
    this.carbs = (<TextField>textfield.object).text.toString();
  }
}
