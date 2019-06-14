import { Injectable } from '@angular/core';
import * as app from 'tns-core-modules/application';
import ContextCompat = android.support.v4.content.ContextCompat;

@Injectable({
  providedIn: 'root'
})
export class ForegroundFacadeService {
  startForeground() {
    if (!app.android || !app.android.context) {
      return;
    }
    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    foregroundNotificationIntent.putExtra('title', 'Serwis pobierania danych z popmy jest w trakcie działania');
    console.log("start freground")
    app.android.context.startService(foregroundNotificationIntent);
  }

  stopForeground() {
    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    console.log("stop freground")
    app.android.context.stopService(foregroundNotificationIntent);
  }
}
