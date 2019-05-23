import { Injectable } from '@angular/core';
import * as app from 'tns-core-modules/application';

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
    foregroundNotificationIntent.putExtra('title', 'Serwis pobierania danych z popmy jest w trakcie działania...');
    app.android.context.startService(foregroundNotificationIntent);
  }

  stopForeground() {
    const foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, 'com.tns.ForegroundService');
    app.android.context.stopService(foregroundNotificationIntent);
  }
}
