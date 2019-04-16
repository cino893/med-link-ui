import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IBasicSettings } from "~/app/model/med-link.model";
import { DatabaseService } from "~/app/shared/database.service";
import { NightscoutApiService } from "~/app/shared/nightscout-api.service";
import { RawDataService } from "~/app/shared/raw-data-parse.service";

const myData = `18-03-2019 22 04
BG:130 21:59 18-03-19
BL:0.6 21:37 18-03-19
PD:0.0 Podano: 0.000
Czas PD: 0m / 0m
ISIG:28.26nA
Wsp.kalibracji: 4.946
Nastepna kalib: 9:40
Czas sensora: 2953min
Cel BG sensor: 80-140
Bateria: dobra(1.27V)
Zbiorniczek: 234.275J
Baza: 1.150J/h
TDP: 100% 0h:00m
Dawka dziasiaj:11.850J
Dawka wczoraj: 2.725J
Max bolud: 5.0U
Krok bolusa: 0.1U
Max. baza: 1.750J/h
Czas insuliny: 3h
Wsp.insulin: 101mg/dl
Wsp.weglowod: 17g/J`;

@Injectable({
  providedIn: "root"
})
export class DataFacadeService {
  constructor(
    private databaseService: DatabaseService,
    private nightscoutApiService: NightscoutApiService,
    private rawDataService: RawDataService
  ) {
    this.databaseService.createTable();
    this.sendDataToLocalDb(this.rawDataService.parseData(myData));
  }

  sendDataToLocalDb(pumpStatus: IBasicSettings) {
    return this.databaseService.insertBG(pumpStatus.bloodGlucose);
  }

  getDatafromLocalDb(): Observable<Array<{ value: number; date: Date }>> {
    return this.databaseService.getBG().pipe(
      map(rows => {
        return rows.map(a => ({
          value: +a[0],
          date: new Date(a[1])
        }));
      })
    );
  }

  sendDatatoNightscout() {
        this.getDatafromLocalDb().subscribe(glucoses =>{
            this.nightscoutApiService.sendNewBG(glucoses);
        })

  }
}
