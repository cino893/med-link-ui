import { Injectable } from '@angular/core';
import { BackgroundFetch } from 'nativescript-background-fetch';
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

    BackgroundFetch.configure({
      minimumFetchInterval: 5,
      stopOnTerminate: false,
      enableHeadless: true
    }, a => console.log(a)|| this.establishConnectionWithPump());
    BackgroundFetch.registerHeadlessTask(async () => {
      console.log('[My BackgroundFetch HeadlessTask] onFetch');
      // Do some asynchronous work (eg: HTTP Request)
      let result = await this.establishConnectionWithPump();
      // Politely signal to the OS that our processing is complete.
      BackgroundFetch.finish();
    });
  }

  sendDataToLocalDb(pumpStatus: IBasicSettings) {
    return this.databaseService.insertBG(pumpStatus.bloodGlucose);
  }

  sendDataToLocalDb2(pumpStatus: IBasicSettings) {
    return this.databaseService.insertTreatments(pumpStatus.lastBolus);
  }

  sendDataToLocalDb3(pumpStatus: IBasicSettings) {
    return this.databaseService.insertDeviceStatus(pumpStatus.insulinInPompLeft, pumpStatus.batteryVoltage, pumpStatus.data, pumpStatus.statusPump);
  }

  sendDataToLocalDb4(pumpStatus: IBasicSettings) {
    return this.databaseService.insertTempBasal(pumpStatus.temporaryBasalMethodPercentage.percentsOfBaseBasal, pumpStatus.temporaryBasalMethodPercentage.timeLeftInMinutes, pumpStatus.temporaryBasalMethodPercentage.timestamp);
  }

  getDatafromLocalDb(): Observable<Array<{ value: number; date: Date; }>> {
    return this.databaseService.getBG().pipe(
      map(rows => {
        return rows.map(a => ({
          value: +a[0],
          date: new Date(a[1])
        }));
      })
    );
  }

  getDatafromLocalDb2(): Observable<Array<{ value: number; date: Date }>> {
    return this.databaseService.getTreatments().pipe(
      map(rows => {
        return rows.map(a => ({
          value: +a[0],
          date: new Date(a[1])
        }));
      })
    );
  }

  getDatafromLocalDb3(): Observable<Array<{ reservoir: number; voltage: number; dateString: Date; percent: number; status: string }>> {
    return this.databaseService.getDS().pipe(
      map(rows => {
        return rows.map(a => ({
          reservoir: +a[0],
          voltage: +a[1],
          dateString: new Date(a[2]),
          percent: +a[3],
          status: a[4]
        }));
      })
    );
  }

  getDatafromLocalDb4(): Observable<Array<{ percentsOfBasal: number; minutes: number; dateString: Date; }>> {
    return this.databaseService.getTempBasal().pipe(
      map(rows => {
        return rows.map(a => ({
          percentsOfBasal: +a[0],
          minutes: +a[1],
          dateString: new Date(a[2])
        }));
      })
    );
  }

  sendDatatoNightscout() {
    this.getDatafromLocalDb().subscribe(glucoses => {
      this.nightscoutApiService.sendNewBG(glucoses);
    });
  }

  sendDatatoNightscout2() {
    this.getDatafromLocalDb2().subscribe(treatments => {
      this.nightscoutApiService.sendNewBol(treatments);
    });
  }

  sendDatatoNightscout3() {
    this.getDatafromLocalDb3().subscribe(deviceStatus => {
      this.nightscoutApiService.sendNewDevicestatus(deviceStatus);
    });
  }

  sendDatatoNightscout4() {
    this.getDatafromLocalDb4().subscribe(tempbasal => {
      this.nightscoutApiService.sendNewTempBasal(tempbasal);
    });
  }

  // hujnia z grzybnią
  establishConnectionWithPump() {
    this.pumpBluetoothApiService.scanAndConnect()
      .then(() => setTimeout(() => this.pumpBluetoothApiService.sendCommand('OK+CONN'), 1000))
      .then(() => this.waitOnReady());
    setInterval(() => {
      this.pumpBluetoothApiService.scanAndConnect()
        .then(() => setTimeout(() => this.pumpBluetoothApiService.sendCommand('OK+CONN'), 1000))
        .then(() => this.waitOnReady());
    }, 5 * 60 * 1000);
  }

  waitOnReady() {
    this.pumpBluetoothApiService.read()
      .subscribe(() => {
        console.log('bedzie ss');
        this.transferDataFromPumpThenToApi();
      });
  }

  // hujnia z grzybnią 2
  transferDataFromPumpThenToApi() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.pumpBluetoothApiService.read2().subscribe(data => {
          const parsedDate = this.rawDataService.parseData(data);
          console.log('sendDataToLocalDb');
          this.sendDataToLocalDb(parsedDate).subscribe(() => {
            this.sendDatatoNightscout();
          });
          this.sendDataToLocalDb2(parsedDate).subscribe(() => {
            this.sendDatatoNightscout2();
          });
          this.sendDataToLocalDb3(parsedDate).subscribe(() => {
            this.sendDatatoNightscout3();
          });
          this.sendDataToLocalDb4(parsedDate).subscribe(() => {
              this.sendDatatoNightscout4();
              console.log('poszlo niezleaaaaa');
              this.databaseService.updateBG();
              this.databaseService.updateTreatments();
              this.databaseService.updateDS();
              this.databaseService.updateTempBasal();
              console.log('sendDataTo udate');
              this.pumpBluetoothApiService.disconnect();
              console.log('rozlaczono');
            }
          );
        });
        setTimeout(() => {
          this.pumpBluetoothApiService.sendCommand2('s');
          resolve();
        }, 1000);
      }, 1000);
    });
  }
}
