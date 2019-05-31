import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBasicSettings } from '~/app/model/med-link.model';
import { DatabaseService } from '~/app/shared/database.service';
import { NightscoutApiService } from '~/app/shared/nightscout-api.service';
import { PumpBluetoothApiService } from '~/app/shared/pump-bluetooth-api.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';
import { WakeFacadeService } from '~/app/shared/wake-facade.service';

@Injectable({
  providedIn: 'root'
})
export class DataFacadeService {
  constructor(
    private databaseService: DatabaseService,
    private nightscoutApiService: NightscoutApiService,
    private pumpBluetoothApiService: PumpBluetoothApiService,
    private rawDataService: RawDataService,
    private wakeFacadeService: WakeFacadeService
  ) {
    this.databaseService.createTable();
  }

  sendDataToLocalDb(pumpStatus: IBasicSettings) {
    return this.databaseService.insertBG(pumpStatus.bloodGlucose);
  }

  sendDataToLocalDb2(pumpStatus: IBasicSettings) {
    return this.databaseService.insertTreatments(pumpStatus.lastBolus);
  }

  sendDataToLocalDb3(pumpStatus: IBasicSettings) {
    return this.databaseService.insertDeviceStatus(
      pumpStatus.insulinInPompLeft,
      pumpStatus.batteryVoltage,
      pumpStatus.data,
      pumpStatus.statusPump
    );
  }

  sendDataToLocalDb4(pumpStatus: IBasicSettings) {
    return this.databaseService.insertTempBasal(
      pumpStatus.temporaryBasalMethodPercentage.percentsOfBaseBasal,
      pumpStatus.temporaryBasalMethodPercentage.timeLeftInMinutes,
      pumpStatus.temporaryBasalMethodPercentage.timestamp
    );
  }

  getDatafromLocalDb(): Observable<Array<{ value: number; date: Date; old: string }>> {
    return this.databaseService.getBG().pipe(
      map(rows => {
        return rows.map(a => ({
          value: +a[0],
          date: new Date(a[1]),
          old: this.setArrow(a[3])
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

  getDatafromLocalDb3(): Observable<Array<{
    reservoir: number;
    voltage: number;
    dateString: Date;
    percent: number;
    status: string;
  }>> {
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

  getDatafromLocalDb4(): Observable<Array<{ percentsOfBasal: number; minutes: number; dateString: Date }>> {
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

  private scanAndConnect() {
   // this.wakeFacadeService.wakeScreenByCall();
    this.pumpBluetoothApiService
      .scanAndConnect()
      .then(() => setTimeout(() => this.pumpBluetoothApiService.sendCommand('OK+CONN'), 1000))
      .then(() => this.waitOnReady());
    // TODO: We have to remove thoose TIMEOUT HELL!!
    //const estimatedTimeToEndTask = 15 * 1000;
    //setTimeout(() => this.wakeFacadeService.snoozeScreenByCall(), estimatedTimeToEndTask);
  }

  establishConnectionWithPump() {
    this.scanAndConnect();
    setInterval(() => this.scanAndConnect(), 5 * 60 * 1000);
  }

  waitOnReady() {
    this.pumpBluetoothApiService.read().subscribe(() => {
      this.transferDataFromPumpThenToApi();
    });
  }
  updateDbRows() {
    this.databaseService.updateBG();
    this.databaseService.updateTreatments();
    this.databaseService.updateDS();
    this.databaseService.updateTempBasal();
  }

  // hujnia z grzybnią 2
  transferDataFromPumpThenToApi() {
    setTimeout(() => this.pumpBluetoothApiService.sendCommand2('s'), 500);
    setTimeout(() => {
      this.pumpBluetoothApiService.read2().subscribe(data => {
        const parsedDate = this.rawDataService.parseData(data);
        this.sendDataToLocalDb(parsedDate).subscribe(() => {
          this.sendDatatoNightscout(); console.log('sendDataToLocalDb');
        });
        this.sendDataToLocalDb2(parsedDate).subscribe(() => {
          this.sendDatatoNightscout2();
        });
        this.sendDataToLocalDb3(parsedDate).subscribe(() => {
          this.sendDatatoNightscout3();
        });
        this.sendDataToLocalDb4(parsedDate).subscribe(() => {
          this.sendDatatoNightscout4();
          this.pumpBluetoothApiService.disconnect();
          console.log('rozlaczono');
          this.updateDbRows();
        });
      });
    }, 1000);
  }

  private setArrow(old: string) {
    if (Number(old) >= -5 && Number(old) <= 5) {
      old = 'Flat';
    }
    if (Number(old) > 5 && Number(old) < 10) {
      old = 'FortyFiveUp';
    }
    if (Number(old) >= 10) {
      old = 'SingleUp';
    }
    if (Number(old) < -5 && Number(old) > -10) {
      old = 'FortyFiveDown';
    }
    if (Number(old) <= -10) {
      old = 'SingleDown';
    }
    return old;
  }
}
