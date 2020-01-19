import { Injectable } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { DatabaseService } from '~/app/shared/database.service';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import * as appSettings from "tns-core-modules/application-settings";
import { WakeFacadeService } from "~/app/shared/wake-facade.service";

@Injectable({
  providedIn: 'root'
})
export class ForegroundFacadeService {
  int1: number;
  interval: number;
  counter: number;
  belka: string = "MED-LINK";
  constructor(
    private fa: DataFacadeService,
    private databaseService: DatabaseService,
    private wakeFacadeService: WakeFacadeService
  ){
  }
  updateForeground(){
    this.databaseService.getLastBg().subscribe(wynik => {
      console.log("to jest wynik co ma isc do belki: " + wynik.toString());
      //this.belka = wynik.toString() + new Date();
      const foregroundNotificationIntent = new android.content.Intent();
      foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
      foregroundNotificationIntent.putExtra('title', 'BG: ' + wynik.toString());
      app.android.context.startService(foregroundNotificationIntent);
      appSettings.setString('BG', wynik.toString());
      //nm.notify(app.android.context, foregroundNotificationIntent);
    });

    //app.android.context.notify(foregroundNotificationIntent);
  }
  startForeground() {
    if (!app.android || !app.android.context) {
      return;
    }
    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    foregroundNotificationIntent.putExtra('title', this.belka);
    console.log("DAJESZ MALENKI2" + this.belka);
    console.log("start freground");
    app.android.context.startService(foregroundNotificationIntent);
    //app.android.context.startForegroundService(foregroundNotificationIntent);
    this.startCountdown(300);
    this.int1 = setInterval(() => { clearInterval(appSettings.getNumber('interval')); this.startCountdown(300); }, 300000);
    appSettings.setNumber("int1", this.int1);
    setTimeout(() => this.fa.establishConnectionWithPump(), 500);
  }

  stopForeground() {
    clearInterval(appSettings.getNumber('int1'));
    clearInterval(appSettings.getNumber('int0'));
    clearInterval(appSettings.getNumber('interval'));
    this.fa.clearInt();
/*    for(let i = 0; i < 100; i++)
    {
      clearInterval(i);
    }*/
    this.wakeFacadeService.cancelAlarm();

    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    console.log("stop freground");
    app.android.context.stopService(foregroundNotificationIntent);
    //app.android.context.stopService(true);
  }
  startCountdown(seconds){
    this.counter = seconds;
    this.interval = setInterval(() => {
      console.log(this.counter);
     // this.uuid = this.counter.toString();
      appSettings.setString("counter", this.counter.toString());
      this.counter--;
      if (this.counter <= 2) {
        clearInterval(appSettings.getNumber('interval'));
        console.log('Ding!');
      }
    }, 1000);
    appSettings.setNumber('interval', this.interval);
  }
}
