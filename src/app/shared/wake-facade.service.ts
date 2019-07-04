import { Injectable } from '@angular/core';
import { Brightness } from 'nativescript-brightness';
import * as Application from 'tns-core-modules/application';
import WindowManager = android.view.WindowManager;

@Injectable({
  providedIn: 'root'
})
export class WakeFacadeService {
  private wakeActivityIntent: android.content.Intent;
  private readonly context = Application.android
    .context as android.content.Context;

  private isOn: boolean;
  private wakeLock: android.os.PowerManager.WakeLock;

  wakeScreenByActivity() {
    if (!this.isOn) {
      this.wakeActivityIntent.setClassName(
        Application.android.context,
        'com.tns.CustomWakingActivity'
      );
      this.wakeActivityIntent.setFlags(
        android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP |
        android.content.Intent.FLAG_ACTIVITY_NEW_TASK
      );
      this.context.startActivity(this.wakeActivityIntent);

      this.isOn = true;
    }
  }

  snoozeActivityScreen() {
    if (this.isOn) {
      this.wakeActivityIntent = new android.content.Intent();
      this.wakeActivityIntent.setClassName(
        Application.android.context,
        'com.tns.CustomWakingActivity'
      );
      this.wakeActivityIntent.setFlags(
        android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP |
        android.content.Intent.FLAG_ACTIVITY_NEW_TASK
      );
      this.wakeActivityIntent.putExtra('finish', true);
      this.context.startActivity(this.wakeActivityIntent);

      this.isOn = false;
    }
    return Promise.resolve();
  }

  wakeScreenByCall() {
    const powerManager = Application.android.context.getSystemService(
      android.content.Context.POWER_SERVICE
    ) as android.os.PowerManager;

    this.wakeLock = powerManager.newWakeLock(
      android.os.PowerManager.PARTIAL_WAKE_LOCK |
      android.os.PowerManager.ACQUIRE_CAUSES_WAKEUP |
      android.os.PowerManager.ON_AFTER_RELEASE,
      'com.tns.wake-facade'
    ) as android.os.PowerManager.WakeLock;
    this.wakeLock.acquire();
    const window = Application.android.foregroundActivity;
    console.log('udalo sie wlaczyc ekran');
  }

  snoozeScreenByCall() {
    this.wakeLock.release();
  }
}
