import { Injectable, NgZone} from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IBasicSettings } from "~/app/model/med-link.model";
import { DatabaseService } from "~/app/shared/database.service";
import { NightscoutApiService } from "~/app/shared/nightscout-api.service";
import { PumpBluetoothApiService } from "~/app/shared/pump-bluetooth-api.service";
import { RawDataService } from "~/app/shared/raw-data-parse.service";
import { WakeFacadeService } from "~/app/shared/wake-facade.service";
import * as appSettings from "application-settings";

@Injectable({
  providedIn: "root"
})
export class DataFacadeService {
  btData: string;
  int0: number;
  stanPump: string = "W TRAKCIE...";

  constructor(
    private databaseService: DatabaseService,
    private zone: NgZone,
    private nightscoutApiService: NightscoutApiService,
    private pumpBluetoothApiService: PumpBluetoothApiService,
    private rawDataService: RawDataService,
    private wakeFacadeService: WakeFacadeService
  ) {
    this.databaseService.createTable();
  }
  clearInt() {
    clearInterval(appSettings.getNumber('int0'));
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

  getDatafromLocalDb(): Observable<
    Array<{ value: number; date: Date; old: string }>
  > {
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

  getDatafromLocalDb3(): Observable<
    Array<{
      reservoir: number;
      voltage: number;
      dateString: Date;
      percent: number;
      status: string;
    }>
  > {
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

  getDatafromLocalDb4(): Observable<
    Array<{ percentsOfBasal: number; minutes: number; dateString: Date }>
  > {
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
    return new Promise((resolve, reject) => {
      this.getDatafromLocalDb().subscribe(glucoses => {
        this.nightscoutApiService
          .sendNewBG(glucoses)
          .then(
            successValue => resolve(successValue),
            errorValue => reject(errorValue)
          );
      });
    });
  }

  sendDatatoNightscout2() {
    return new Promise((resolve, reject) => {
      this.getDatafromLocalDb2().subscribe(treatments => {
        this.nightscoutApiService
          .sendNewBol(treatments)
          .then(
            successValue => resolve(successValue),
            errorValue => reject(errorValue)
          );
      });
    });
  }

  sendDatatoNightscout3() {
    return new Promise((resolve, reject) => {
      this.getDatafromLocalDb3().subscribe(deviceStatus => {
        this.nightscoutApiService
          .sendNewDevicestatus(deviceStatus)
          .then(
            successValue => resolve(successValue),
            errorValue => reject(errorValue)
          );
      });
    });
  }

  sendDatatoNightscout4() {
    return new Promise((resolve, reject) => {
      this.getDatafromLocalDb4().subscribe(tempbasal => {
        this.nightscoutApiService
          .sendNewTempBasal(tempbasal)
          .then(
            successValue => resolve(successValue),
            errorValue => reject(errorValue)
          );
      });
    });
  }

  private scanAndConnect() {
    //this.wakeFacadeService.wakeScreenByCall();
    try {
      this.pumpBluetoothApiService
        .scanAndConnect()
        .then(
          uidBt => {
            if (uidBt === "MED-LINK" || uidBt === "MED-LINK-2" || uidBt === "MED-LINK-3" || uidBt === "HMSoft") {
              console.log(uidBt + "BBBBBBBBBBBBBBBBBBBBB");
              return Promise.resolve(uidBt);
            } else {
              console.log(uidBt + "Nie udalo sie polaczyc booooooo oooooooo status 133");
              return Promise.reject();
            }
          },
          uidBt => {
            console.log("poszedł prawdziwy reject11!!!!!" + uidBt + "       d");
            return this.pumpBluetoothApiService.scanAndConnect().then(
              uidBt2 => {
                if (uidBt2 === "HMSoft") {
                  console.log(uidBt2 + "BBBBBBBBBBBBBBBBBBBBB");
                  return Promise.resolve(uidBt2);
                } else {
                  console.log(
                    uidBt2 + "Nie udalo sie polaczyc booooooo oooooooo status 133"
                  );
                  return Promise.reject();
                }
                console.log("XaXaXaXaXa");
              },
              () => {
                console.log("jednak nie udalo sie za 2");
                return Promise.reject();
              }
            );
          }
        )
        .then(
          () =>
            setTimeout(
              () => this.pumpBluetoothApiService.sendCommand("OK+CONN"),
              500
            ),
          () => {
            console.log("zatem nie wyslam ok kona");
            return Promise.reject(console.log("adam23333333"));
          }
        )
        .then(
          () => {
            this.waitOnReady();
          },
          () => {
            console.log("zatem nie czekam na ready");
            //this.wakeFacadeService.snoozeScreenByCall();
          }
        )
        .catch(error => console.log("error: ", error));
    } catch {
      console.log("Totalna zsssajebka");
    }
    //const estimatedTimeToEndTask = 30 * 1000;
    //setTimeout(() => this.wakeFacadeService.snoozeScreenByCall(), estimatedTimeToEndTask);
  }
   scanAndConnectStop() {
    this.wakeFacadeService.wakeScreenByCall();
     return new Promise((resolve, reject) => {
    try {
      this.pumpBluetoothApiService
        .scanAndConnect()
        .then(
          uidBt => {
            if (uidBt === "MED-LINK" || uidBt === "MED-LINK-2" || uidBt === "MED-LINK-3" || uidBt === "HMSoft") {
              console.log(uidBt + "BBBBBBBBBBBBBBBBBBBBB");
              return Promise.resolve(uidBt);
            } else {
              console.log(uidBt + "Nie udalo sie polaczyc booooooo oooooooo status 133");
              return Promise.reject();
            }
          },
          uidBt => {
            console.log("poszedł prawdziwy reject11!!!!!" + uidBt + "       d");
            return this.pumpBluetoothApiService.scanAndConnect().then(
              uidBt2 => {
                if (uidBt2 === "HMSoft") {
                  console.log(uidBt2 + "BBBBBBBBBBBBBBBBBBBBB");
                  return Promise.resolve(uidBt2);
                } else {
                  console.log(
                    uidBt2 + "Nie udalo sie polaczyc booooooo oooooooo status 133"
                  );
                  return Promise.reject();
                }
                console.log("XaXaXaXaXa");
              },
              () => {
                console.log("jednak nie udalo sie za 2");
                return Promise.reject();
              }
            );
          }
        )
        .then(
          () =>
            setTimeout(
              () => this.pumpBluetoothApiService.sendCommand("OK+CONN"),
              500
            ),
          () => {
            console.log("zatem nie wyslam ok kona");
            return Promise.reject(console.log("adam23333333"));

          }
        )
        .then(
          () => {
            const timeoutAlert = setTimeout(() => this.errorPumpStan(), 63 * 1000);
            this.pumpBluetoothApiService.read().subscribe(() => {
              this.pumpBluetoothApiService.sendCommand2("a");
              setTimeout(() => this.pumpBluetoothApiService.read3()
                  .subscribe( dane => {
                    console.log("To jest wynik"+ dane);
                    if (dane.toString().includes("uruchomiona")){
                      console.log("STOP POMPA");
                      this.pumpBluetoothApiService.sendCommand("stop");
                      setTimeout( () => this.pumpBluetoothApiService.read5().subscribe(() => {
                        this.zone.run (() => appSettings.setString("pumpStan", "WZNOW POMPE"));
                        this.pumpBluetoothApiService.disconnect();
                        clearTimeout(timeoutAlert);
                        resolve();
                      }), 500);
                    } else
                    {
                      console.log("START POMPA!!!");
                      this.pumpBluetoothApiService.sendCommand("start");
                      setTimeout( () => this.pumpBluetoothApiService.read4().subscribe(() => {
                        this.zone.run (() => appSettings.setString("pumpStan", "ZAWIES POMPE"));
                        this.pumpBluetoothApiService.disconnect();
                        clearTimeout(timeoutAlert);
                        resolve();
                      }), 500);
                    }
                  }, () => this.errorPumpStan())
                , 400);
            }, () => this.errorPumpStan());
          },
          () => {
            console.log("zatem nie czekam na ready");
            this.errorPumpStan();
            reject();
            this.wakeFacadeService.snoozeScreenByCall();
          }
        )
    } catch {
      console.log("Totalna zsssajebka");
      reject();
    }
    //const estimatedTimeToEndTask = 30 * 1000;
    //setTimeout(() => this.wakeFacadeService.snoozeScreenByCall(), estimatedTimeToEndTask);
  })
  }
  errorPumpStan(){
    appSettings.setBoolean("isBusy", false);
    appSettings.setString("pumpStan", "ZMIEN STAN POMPY");
    const options = {
      title: "Cos poszło nie tak",
      message: "Sprawdz stan pompy!",
      okButtonText: "Przyjąłem do wiadomości"
    };
    alert(options);
  }

  establishConnectionWithPump() {
    //this.scanAndConnect();
    // setInterval(() => this.scanAndConnect(),  60 * 1000);
    this.wakeFacadeService.setAlarm();
    this.scanAndConnect();
    this.int0 = setInterval(() => this.scanAndConnect(),  5 * 60 * 1000);
    appSettings.setNumber('int0', this.int0);

  }


  waitOnReady() {
    this.pumpBluetoothApiService.read().subscribe(() => {
      this.transferDataFromPumpThenToApi();
    });
  }
  waitOnReadyStop() {
    this.pumpBluetoothApiService.read().subscribe(() => {
     // this.transferDataFromPumpThenToApi();
      this.checStatusPump();
    });
  }
  checStatusPump(){
    setTimeout(() => this.pumpBluetoothApiService.sendCommand2("a"), 400);
    setTimeout(() => this.pumpBluetoothApiService.read3()
        .subscribe( dane => {
          console.log("To jest wynik"+ dane);
          if (dane.toString().includes("uruchomiona")){
            console.log("STOP POMPA");
            this.pumpBluetoothApiService.sendCommand("stop");
            setTimeout( () => this.pumpBluetoothApiService.read3().subscribe(() => {
              this.zone.run (() => this.stanPump = "WYLACZ POMPE");
              this.pumpBluetoothApiService.disconnect();
            }), 500);
          } else
            {
            console.log("START POMPA!!!");
            this.pumpBluetoothApiService.sendCommand("start");
            setTimeout( () => this.pumpBluetoothApiService.read3().subscribe(() => {
              this.zone.run (() => this.stanPump = "WLACZ POMPE");
              this.pumpBluetoothApiService.disconnect()}), 500);
          }
        })
      , 400);
  }

  preventLowSugar(a: number, b: string) {
    if (appSettings.getBoolean('auto', false) && a <= appSettings.getNumber('range', 75) && !(a === 0) && !(a.toString() === '000') && b.toLowerCase().includes('normal')){
      console.log("AKT WOJNY" + a + b + appSettings.getBoolean('auto', false));
      this.scanAndConnectStop().then(() => {
        console.log("Pompa wyl");
        appSettings.setString("autostop", new Date().toString().substring(3, 21) + " UWAGA POMPA ZATRZYMANA PRZEZ FUNKCJE AUTO STOP\n\n" );
      }, () => console.log("BADD ASS nie wylaczona"));
    }
    else {
      console.log("AKT WOJNY2" + a + b.toLowerCase());
      if (appSettings.getBoolean('auto', false) && a > appSettings.getNumber('range', 75) && !(a === 0) && !(a.toString() === '000') && b.toLowerCase().includes('suspend')){
        console.log("AKT WOJNY3" + a + b);
        this.scanAndConnectStop().then(() => {
          console.log("Pompa wlaczona");
          appSettings.setString("autostop", new Date().toString().substring(3, 21) + " UWAGA POMPA WZNOWIONA PRZEZ FUNKCJE AUTO START\n\n");
        }, () => console.log("BADD ASS 2 nie wylaczona"));
      }
      else {
        console.log("Nie uzywam auto stop/start" + a + b);
        this.pumpBluetoothApiService.disconnect();
      }

    }

  }
  transferDataFromPumpThenToApi() {
    setTimeout(() => this.pumpBluetoothApiService.sendCommand2("s"), 400);
    setTimeout(() => {
      this.pumpBluetoothApiService.read2().subscribe(data => {
        console.log('TOOOOO:   ' + data.toString());
        this.btData = data.toString();
        const parsedDate = this.rawDataService.parseData(data);
          this.sendDataToLocalDb(parsedDate)
            .then(() => { console.log('AAAAA doszlo'); this.sendDataToLocalDb2(parsedDate); })
            .then(() => this.sendDataToLocalDb3(parsedDate))
            .then(() => this.sendDataToLocalDb4(parsedDate))
            .then(() => this.sendDatatoNightscout3())
            .then(() => this.databaseService.updateDS())
            .then(() => this.sendDatatoNightscout())
            .then(() => this.databaseService.updateBG())
            .then(() => this.sendDatatoNightscout2())
            .then(() => this.databaseService.updateTreatments())
            .then(() => this.sendDatatoNightscout4())
            .then(() => this.databaseService.updateTempBasal())
            .then(() => this.preventLowSugar(parsedDate.bloodGlucose.value, parsedDate.statusPump.toString()))

          //.then(() => this.wakeFacadeService.snoozeScreenByCall())
          .catch(error => {
            console.log(error);
            //this.wakeFacadeService.snoozeScreenByCall()
          });
        //this.pumpBluetoothApiService.disconnect();
      });
    }, 400);
  }

  private setArrow(old: string) {
    if (Number(old) >= -5 && Number(old) <= 5) {
      old = "Flat";
    }
    if (Number(old) > 5 && Number(old) < 10) {
      old = "FortyFiveUp";
    }
    if (Number(old) >= 10) {
      old = "SingleUp";
    }
    if (Number(old) < -5 && Number(old) > -10) {
      old = "FortyFiveDown";
    }
    if (Number(old) <= -10) {
      old = "SingleDown";
    }
    return old;
  }
}
