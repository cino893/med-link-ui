import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { knownFolders } from 'tns-core-modules/file-system';
import { nightScoutPath } from "~/app/env";
import { DatabaseService } from "~/app/shared/database.service";
import temp = knownFolders.temp;

@Injectable({
  providedIn: "root"
})
export class NightscoutApiService {
  secret = "d6026bb45e7efd38de82680c75d31cf7f7a6a1e3";
  //secret = '258628a55f1370569738e7da6d135c61dcaea7c9';
  device = 'Med-Link';
  timezone = '+02:00';
  constructor(private httpClient: HttpClient) {}

  sendNewBG(glucoses: Array<{ value: number; date: Date; }>) {
      this.httpClient
      .post(
        nightScoutPath + 'entries',
        glucoses.map(glucose => ({
          device: this.device,
          secret: this.secret,
          sgv: glucose.value,
          date: +glucose.date,
          direction: 'FortyFiveDown',
        }))).subscribe();
  }
  sendNewBol(treatments: Array<{ value: number; date: Date }>) {
        this.httpClient
            .post(
                nightScoutPath + 'treatments',
                treatments.map(bol => ({
                    enteredBy: this.device,
                    secret: this.secret,
                    insulin: bol.value,
                    created_at: bol.date + this.timezone,
                }))).subscribe();
  }
  sendNewTempBasal(tempbasal: Array<{ percentsOfBasal: number; minutes: number; dateString: Date }>) {
        this.httpClient
            .post(
                nightScoutPath + 'treatments',
                tempbasal.map(bol => ({
                    enteredBy: this.device,
                    secret: this.secret,
                    duration: bol.minutes,
                    created_at: bol.dateString + this.timezone,
                    percent: bol.percentsOfBasal,
                    rate: 0.7,
                    eventType: 'Temp Basal',
                    timestamp: new Date(),
                }))).subscribe();
  }
  sendNewDevicestatus(deviceStatus: Array<{ reservoir: number; voltage: number; dateString: Date; percent: number; status: string }>) {
        this.httpClient
            .post(
                nightScoutPath + 'devicestatus',
                deviceStatus.map(bol => ({
                    device: this.device,
                    secret: this.secret,
                    created_at: new Date(),
                    pump: { clock: bol.dateString, reservoir: bol.reservoir, status: { status: bol.status, timestamp: 1557061755 }, extended: { version: '1.0', ActiveProfile: 'medlink' }, battery: { voltage: bol.voltage.toString().substring(0, 4) } },
                    uploaderBattery: bol.percent,
                }))).subscribe();
    }
}
