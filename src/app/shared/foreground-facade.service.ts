import { Injectable } from '@angular/core';
import * as app from "tns-core-modules/application";

@Injectable({
  providedIn: 'root'
})
export class ForegroundUtilService {
  startForeground() {
    if(!app.android || !app.android.context){
      return;
    }
    var foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, "com.tns.ForegroundService");
    foregroundNotificationIntent.putExtra("title","Tracking...");
    app.android.context.startService(foregroundNotificationIntent);
  }

  stopForeground() {
    var foregroundNotificationIntent = new android.content.Intent();
    foregroundNotificationIntent.setClassName(app.android.context, "com.tns.ForegroundService");
    app.android.context.stopService(foregroundNotificationIntent);
  }
}
