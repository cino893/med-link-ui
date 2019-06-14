import * as Application from 'application';

@JavaProxy('com.tns.ForegroundService')
export class ForegroundService extends android.app.Service {
  public onCreate(): void {
    super.onCreate();
  }

  public onDestroy(): void {
    super.onDestroy();
    this.stopForeground(true);
  }

  public onBind(param0: android.content.Intent): android.os.IBinder {
    console.log(param0);
    return null;
  }

  public onStartCommand(
    intent: android.content.Intent,
    flags: number,
    startId: number
  ) {
    super.onStartCommand(intent, flags, startId);
    this.startForeground(1, this.createNotification(intent));
    console.log("start foreground onstartCommad");

    return android.app.Service.START_STICKY;
  }

  private createNotification(
    intent: android.content.Intent
  ): android.app.Notification {
    this.disableDozeMode();
    this.createNotificationChannel();
    return this.getNotificationBuilder()
      .setSmallIcon(android.R.drawable.btn_plus)
      .setContentTitle(this.getTitle(intent))
      .build();
  }

  private disableDozeMode() {
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      const intent = new android.content.Intent();
      const context = Application.android.context;
      const packageName = context.getPackageName();
      const pm = context.getSystemService(
        android.content.Context.POWER_SERVICE
      );

      intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK);

      if (!pm.isIgnoringBatteryOptimizations(packageName)) {
        intent.setAction(
          android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
        );
        intent.setData(android.net.Uri.parse('package:' + packageName));
        context.startActivity(intent);
      }

      // this.wakeScreenByActivity();
    }
  }

  private getNotificationBuilder() {
    if (!android.support.v4.os.BuildCompat.isAtLeastO()) {
      // Not Oreo, not creating notification channel as compatibility issues may exist
      return new android.support.v4.app.NotificationCompat.Builder(this);
    }

    return new android.support.v4.app.NotificationCompat.Builder(
      this,
      'TNS-ForegroundService-1'
    );
  }

  private createNotificationChannel() {
    if (!android.support.v4.os.BuildCompat.isAtLeastO()) {
      // Not Oreo, not creating notification channel as compatibility issues may exist
      return;
    }
    const importance =
      android.support.v4.app.NotificationManagerCompat.IMPORTANCE_LOW;
    const mChannel = new android.app.NotificationChannel(
      'TNS-ForegroundService-1',
      'TNS-ForegroundService-1',
      importance
    );
    var nm = this.getSystemService(
      android.content.Context.NOTIFICATION_SERVICE
    );
    nm.createNotificationChannel(mChannel);
  }

  private getTitle(intent: android.content.Intent): string {
    const title = intent.getStringExtra('title');
    if (title) {
      return title;
    } else {
      return 'Running in background';
    }
  }

  public onStart(intent: android.content.Intent, startId: number) {
    super.onStart(intent, startId);
  }
}
