import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { knownFolders } from 'tns-core-modules/file-system';
import { resetProfiles } from 'tns-core-modules/profiling';
import { nightScoutPath } from '~/app/env';
import { DatabaseService } from '~/app/shared/database.service';
import temp = knownFolders.temp;

@Injectable({
  providedIn: 'root'
})
export class NightscoutApiService {
  //secret = 'd6026bb45e7efd38de82680c75d31cf7f7a6a1e3';
  secret = '258628a55f1370569738e7da6d135c61dcaea7c9';
  device = 'Med-Link';
  timezone = '+02:00';
  http = '';
  hash = '';

  constructor(private httpClient: HttpClient,
  private databaseService: DatabaseService) {
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

  getConfig() {
    return new Promise((resolve, reject) => {
      this.getNSData().subscribe(g => {
        g.map(bol => {
          this.http = bol.http.toString();
          this.hash = bol.secret.toString();
        });
        console.log("TO JEST API I SECRET Z BAZY aaaaaaaassssssss" + this.http + this.hash);
        resolve(),
          reject();
      });
      });
  }

  sendNewBG(glucoses: Array<{ value: number; date: Date; old: string }>) {
    return new Promise((resolve, reject) => {
      if (glucoses.length > 1) {
        console.log("DLUGOSC API KOMUNIKATU:  " + glucoses.length);
        this.httpClient
          .post(
            this.http + '/api/v1/entries',
            glucoses.map(glucose => ({
              device: this.device,
              secret: this.hash,
              sgv: glucose.value,
              date: +glucose.date,
              direction: glucose.old
            }))).subscribe(resolve, reject);
      }
      else {
        console.log("Przyszedł zły cukier!!");
        resolve();
      }
    });
  }

  sendNewBol(treatments: Array<{ value: number; date: Date }>) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          this.http + '/api/v1/treatments',
          treatments.map(bol => ({
            enteredBy: this.device,
            secret: this.hash,
            insulin: bol.value,
            created_at: bol.date
          }))).subscribe(resolve, reject);
    });
  }

  sendNewTempBasal(tempbasal: Array<{ percentsOfBasal: number; minutes: number; dateString: Date }>) {
    return new Promise((resolve, reject) => {
      this.httpClient
        .post(
          this.http + '/api/v1/treatments',
          tempbasal.map(bol => ({
            enteredBy: this.device,
            secret: this.hash,
            duration: bol.minutes,
            created_at: bol.dateString + this.timezone,
            percent: bol.percentsOfBasal,
            rate: 0.7,
            eventType: 'Temp Basal',
            timestamp: new Date()
          }))).subscribe(resolve, reject);
    });
  }

  sendNewDevicestatus(deviceStatus: Array<{ reservoir: number; voltage: number; dateString: Date; percent: number; status: string }>) {
    return new Promise ((resolve, reject) => {
      this.getConfig().then(() =>
    this.httpClient
      .post(
        this.http + '/api/v1/devicestatus',
        deviceStatus.map(bol => ({
          device: this.device,
          secret: this.hash,
          created_at: new Date(),
          pump: {
            clock: bol.dateString,
            reservoir: bol.reservoir,
            status: { status: bol.status, timestamp: 1557061755 },
            extended: { version: '1.0', ActiveProfile: 'medlink' },
            battery: { voltage: bol.voltage.toString().substring(0, 4) }
          },
          uploaderBattery: bol.percent
        }))).subscribe(resolve, reject))s;
  });
}}
