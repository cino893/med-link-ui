"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// this import should be first in order to load some required settings (like globals and reflect-metadata)
var platform_1 = require("nativescript-angular/platform");
var trace_1 = require("tns-core-modules/trace");
var traceModule = require("tns-core-modules/trace");
var app_module_1 = require("./app/app.module");
var info = trace_1.messageType.info;
var errorHandler = {
    handlerError: function (err) {
        //option 1 (development) - throw the error
        traceModule.write(info, "unhandled-error");
    }
};
traceModule.setErrorHandler(errorHandler);
platform_1.platformNativeScriptDynamic().bootstrapModule(app_module_1.AppModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwR0FBMEc7QUFDMUcsMERBQTRFO0FBRTVFLGdEQUFxRDtBQUNyRCxvREFBcUQ7QUFDckQsK0NBQTZDO0FBQzdDLElBQU8sSUFBSSxHQUFHLG1CQUFXLENBQUMsSUFBSSxDQUFDO0FBRS9CLElBQU0sWUFBWSxHQUE2QjtJQUM3QyxZQUFZLFlBQUMsR0FBRztRQUNkLDBDQUEwQztRQUMxQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQzdDLENBQUM7Q0FDRixDQUFDO0FBQ0YsV0FBVyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUMxQyxzQ0FBMkIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxzQkFBUyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLy8gdGhpcyBpbXBvcnQgc2hvdWxkIGJlIGZpcnN0IGluIG9yZGVyIHRvIGxvYWQgc29tZSByZXF1aXJlZCBzZXR0aW5ncyAobGlrZSBnbG9iYWxzIGFuZCByZWZsZWN0LW1ldGFkYXRhKVxyXG5pbXBvcnQgeyBwbGF0Zm9ybU5hdGl2ZVNjcmlwdER5bmFtaWMgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvcGxhdGZvcm1cIjtcclxuaW1wb3J0ICogYXMgYXBwbGljYXRpb24gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjtcclxuaW1wb3J0IHsgbWVzc2FnZVR5cGUgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3RyYWNlJztcclxuaW1wb3J0ICogYXMgdHJhY2VNb2R1bGUgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvdHJhY2VcIlxyXG5pbXBvcnQgeyBBcHBNb2R1bGUgfSBmcm9tIFwiLi9hcHAvYXBwLm1vZHVsZVwiO1xyXG5pbXBvcnQgaW5mbyA9IG1lc3NhZ2VUeXBlLmluZm87XHJcblxyXG5jb25zdCBlcnJvckhhbmRsZXI6IHRyYWNlTW9kdWxlLkVycm9ySGFuZGxlciA9IHtcclxuICBoYW5kbGVyRXJyb3IoZXJyKSB7XHJcbiAgICAvL29wdGlvbiAxIChkZXZlbG9wbWVudCkgLSB0aHJvdyB0aGUgZXJyb3JcclxuICAgIHRyYWNlTW9kdWxlLndyaXRlKGluZm8sIFwidW5oYW5kbGVkLWVycm9yXCIpO1xyXG4gIH1cclxufTtcclxudHJhY2VNb2R1bGUuc2V0RXJyb3JIYW5kbGVyKGVycm9ySGFuZGxlcik7XHJcbnBsYXRmb3JtTmF0aXZlU2NyaXB0RHluYW1pYygpLmJvb3RzdHJhcE1vZHVsZShBcHBNb2R1bGUpO1xyXG4iXX0=