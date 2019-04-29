import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBasicSettings } from '~/app/model/med-link.model';
import { DatabaseService } from '~/app/shared/database.service';
import { NightscoutApiService } from '~/app/shared/nightscout-api.service';
import { PumpBluetoothApiService } from '~/app/shared/pump-bluetooth-api.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';

@Injectable({
  providedIn: 'root'
})
export class DataFacadeService {
  constructor(
    private databaseService: DatabaseService,
    private nightscoutApiService: NightscoutApiService,
    private pumpBluetoothApiService: PumpBluetoothApiService,
    private rawDataService: RawDataService
  ) {
    this.databaseService.createTable();
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
    this.getDatafromLocalDb().subscribe(glucoses => {
      console.log('sendNewBG');
      this.nightscoutApiService.sendNewBG(glucoses);
    });
  }

  // hujnia z grzybnią
  establishConnectionWithPump() {
    this.pumpBluetoothApiService.scanAndConnect().then(() => this.pumpBluetoothApiService.disconnect());
    setTimeout(
      () =>
        this.pumpBluetoothApiService
          .scanAndConnect()
          .then(() => this.transferDataFromPumpThenToApi()),
      21 * 1000
    );
    setInterval(() => {
      this.pumpBluetoothApiService.scanAndConnect().then(() => this.pumpBluetoothApiService.disconnect());
      setTimeout(
        () =>
          this.pumpBluetoothApiService
            .scanAndConnect()
            .then(() => this.transferDataFromPumpThenToApi()),
        21 * 1000
      );
    }, 5 * 60 * 1000);
  }

  // hujnia z grzybnią 2
  transferDataFromPumpThenToApi() {
    setTimeout(() => {
      this.pumpBluetoothApiService.read().subscribe(data => {
        const parsedDate = this.rawDataService.parseData(data);
        console.log('sendDataToLocalDb');
        this.sendDataToLocalDb(parsedDate).subscribe(() => {
            console.log('sendDatatoNightscout');
            this.sendDatatoNightscout();
          }
        );
      });
      setTimeout(() => this.pumpBluetoothApiService.sendCommand('s'), 1000);
    }, 5000);
  }
}
