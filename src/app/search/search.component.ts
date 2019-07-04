import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { alert } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import { nightScoutPath } from "~/app/env";
import { DatabaseService } from '~/app/shared/database.service';

@Component({
  selector: "Search",
  moduleId: module.id,
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent {
  nsUrl: string;
  nsKey: string;
  carbs: string;
  pending = false;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private databaseService: DatabaseService) {
    // Use the constructor to inject services.
  }
  setPer() {
    console.log("aaaaaa" + this.nsUrl);
    this.databaseService.insertNS(this.nsUrl, this.nsKey);
    //this.databaseService.updateNS("adsad", "1231231");
    console.log("abbbb" + this.nsUrl + ' ddddddddddd ' + this.nsKey);
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

  getNSData(): Observable<Array<{ http: string; secret: string }>> {
    return this.databaseService.NSconf().pipe(
      map(rows => {
        return rows.map(a => ({
          http: a[0],
          secret: a[1]
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
