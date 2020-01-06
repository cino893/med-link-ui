import { Injectable } from '@angular/core';
import * as app from 'tns-core-modules/application';
import { DatabaseService } from '~/app/shared/database.service';

@Injectable({
  providedIn: 'root'
})
export class WidgetFacadeService {
  int1: number;
  interval: number;
  counter: number;
  belka: string = "MED-LINK";
  constructor(
    private databaseService: DatabaseService
  ){
  }
  updateWidget(){
   // const context = app.android.context;
   // const res = context.getResources().getIdentifier("my_widget", "layout", context.getPackageName());
    //console.log(res.toString());
    this.databaseService.getLastBg().subscribe(wynik => {
      console.log("to jest wynik co ma isc do belki: " + wynik.toString());
      //this.belka = wynik.toString() + new Date();
      const widgetNotificationIntent = new android.content.Intent();
      widgetNotificationIntent.setClassName(app.android.context, 'com.tns.MyWidget');
      widgetNotificationIntent.setAction(android.appwidget.AppWidgetManager.ACTION_APPWIDGET_UPDATE);
      widgetNotificationIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_IDS, 1);
      widgetNotificationIntent.setAction('a');
      //android.app.PendingIntent.getBroadcast(app.android.context, 0, widgetNotificationIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
      console.log("Update called ttss!");

     // const views = new android.widget.RemoteViews(app.android.context.getPackageName(), android.R.layout.my_widget_info);
      //views.setTextViewText(res.id.taps_text, '5');

      //const startAppIntent = new android.content.Intent();
      //startAppIntent.setClassName(app.android.context, 'com.tns.NativeScriptActivity');
      //startAppIntent.putExtra(android.appwidget.AppWidgetManager.EXTRA_APPWIDGET_ID, 0);
      //const pI = android.app.PendingIntent.getBroadcast(app.android.context, 0, widgetNotificationIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
      //const pI2 = android.app.PendingIntent.getActivity(app.android.context, 0, startAppIntent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
      //console.log(pI.toString());
      //views.setOnClickPendingIntent(android.R.id.text1, pI);
      //views.setOnClickPendingIntent(android.R.id.button1, pI2);
      //app.android.context.updateAppWidget(0, views);
    });
  }
}
