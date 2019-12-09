import * as Application from 'tns-core-modules/application';
import PendingIntent = android.app.PendingIntent;

@JavaProxy('com.tns.ForegroundService')
export class ForegroundService extends android.app.Service {
  constructor(
  ){
    super();
  }

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
    //intent.putExtra('title', 'Medlink');
    const openActivityIntent = new android.content.Intent();
    openActivityIntent.setClassName(Application.android.context, 'com.tns.NativeScriptActivity');
    openActivityIntent.setFlags(android.content.Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | android.content.Intent.FLAG_ACTIVITY_NEW_TASK);
    const openActivityPendingIntent = PendingIntent.getActivity(Application.android.context, 0, openActivityIntent, 0);


    this.createNotificationChannel();
    return this.getNotificationBuilder()
      .setSmallIcon(android.R.drawable.btn_star)
      .setContentTitle(this.getTitle(intent))
      .setContentIntent(openActivityPendingIntent)
      .build();
  }

  private disableDozeMode() {
    if (android.os.Build.VERSION.SDK_INT >= 24) {
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
        console.log('udalo sie usunac optymaliazacje baterii');
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
  public updateNotification(){
    //this.createNotification("a");
     const importance =
       android.support.v4.app.NotificationManagerCompat.IMPORTANCE_LOW;
     const mChannel = new android.app.NotificationChannel(
       'TNS-ForegroundService-1',
       'TNS-ForegroundService-1',
       importance
     );

    //Notification notification=getMyActivityNotification(text);
    // NotificationManager mNotificationManager=(NotificationManager)getSystemService(Context.NOTIFICATION_SERVICE);
     const nm = this.getSystemService(
       android.content.Context.NOTIFICATION_SERVICE
     );
     nm.notify(1, mChannel);
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
    if (intent.hasExtra('title')){

      const title = intent.getStringExtra('title').toString();
      if (title) {
        if (title === null){
          return "MED-LINK2"
        }
        else {
          return title;
        }
      } else {
        return 'MED-LINK';
      }
    }
    else {
      console.log("BAD ERROR!!");
    }
  }

  public onStart(intent: android.content.Intent, startId: number) {
    super.onStart(intent, startId);
  }
}
