import { Injectable } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { DatabaseService } from '~/app/shared/database.service';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import * as appSettings from "tns-core-modules/application-settings";

@Injectable({
  providedIn: 'root'
})
export class ForegroundFacadeService {
  int0: number;
  int1: number;
  interval: number;
  counter: number;
  constructor(
    private fa: DataFacadeService,
    private databaseService: DatabaseService
  ){
  }
  startForeground() {
    if (!app.android || !app.android.context) {
      return;
    }
    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    foregroundNotificationIntent.putExtra('title', 'Serwis pobierania danych z pompy jest w trakcie działania');
    console.log("start freground");
    app.android.context.startService(foregroundNotificationIntent);
    //app.android.context.startForegroundService(foregroundNotificationIntent);
    this.startCountdown(300);
    this.int1 = setInterval(() => { clearInterval(this.interval); this.startCountdown(300);}, 300000);
    this.int0 = setInterval(() => console.log('interval22         ' + new Date() + 'a'), 10000);
    setTimeout(() => this.fa.establishConnectionWithPump(), 500);
  }

  stopForeground() {
    clearInterval(this.int0);
    clearInterval(this.int1);
    clearInterval(this.fa.int0);
    clearInterval(this.interval);
    this.fa.clearInt();
    for(let i = 0; i < 100; i++)
    {
      clearInterval(i);
    }
    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    console.log("stop freground");
    app.android.context.stopService(foregroundNotificationIntent);
  }
  startCountdown(seconds){
    this.counter = seconds;
    this.interval = setInterval(() => {
      console.log(this.counter);
     // this.uuid = this.counter.toString();
      appSettings.setString("counter", this.counter.toString());
      this.counter--;
      if (this.counter <= 2) {
        clearInterval(this.interval);
        console.log('Ding!');
      }
    }, 1000);
  }
}
