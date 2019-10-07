
// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import * as application from "tns-core-modules/application";
import { messageType } from 'tns-core-modules/trace';
import * as traceModule from "tns-core-modules/trace"
import { AppModule } from "./app/app.module";
import info = messageType.info;

const errorHandler: traceModule.ErrorHandler = {
  handlerError(err) {
    //option 1 (development) - throw the error
    traceModule.write(info, "unhandled-error");
  }
};
traceModule.setErrorHandler(errorHandler);
platformNativeScriptDynamic().bootstrapModule(AppModule);
