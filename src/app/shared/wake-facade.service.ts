import { Injectable } from '@angular/core';
import * as Application from 'application';

@Injectable({
  providedIn: 'root'
})
export class WakeFacadeService {
  private wakeActivityIntent: android.content.Intent;
  private readonly context = Application.android
    .context as android.content.Context;

  private isOn: boolean;

  wakeScreen() {
    if (!this.isOn) {
      this.wakeActivityIntent.setClassName(
        Application.android.context,
        'com.tns.CustomWakeActivity'
      );
      this.wakeActivityIntent.setFlags(
        android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP |
        android.content.Intent.FLAG_ACTIVITY_NEW_TASK
      );
      this.context.startActivity(this.wakeActivityIntent);

      this.isOn = true;
    }
  }

  snoozeScreen() {
    if (this.isOn) {
      this.wakeActivityIntent = new android.content.Intent();
      this.wakeActivityIntent.setClassName(
        Application.android.context,
        'com.tns.CustomWakeActivity'
      );
      this.wakeActivityIntent.setFlags(
        android.content.Intent.FLAG_ACTIVITY_SINGLE_TOP |
        android.content.Intent.FLAG_ACTIVITY_NEW_TASK
      );
      this.wakeActivityIntent.putExtra('finish', true);
      this.context.startActivity(this.wakeActivityIntent);

      this.isOn = false;
    }
  }
}
