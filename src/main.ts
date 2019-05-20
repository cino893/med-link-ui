// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from 'nativescript-angular/platform';

import { AppModule } from './app/app.module';

import { BackgroundFetch } from 'nativescript-background-fetch';

import * as app from 'application';

if (app.ios) {
  class MyDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];

    public applicationPerformFetchWithCompletionHandler(application: UIApplication, completionHandler: any) {
      BackgroundFetch.performFetchWithCompletionHandler(completionHandler, application.applicationState);
    }
  }

  app.ios.delegate = MyDelegate;
}

platformNativeScriptDynamic().bootstrapModule(AppModule);
