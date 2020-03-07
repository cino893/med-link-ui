"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_email_1 = require("nativescript-email");
var Permissions = require("nativescript-permissions");
var operators_1 = require("rxjs/operators");
var data_facade_service_1 = require("~/app/shared/data-facade.service");
var database_service_1 = require("~/app/shared/database.service");
var trace_writer_service_1 = require("~/app/shared/trace-writer.service");
var Runtime = java.lang.Runtime;
var fs = require("tns-core-modules/file-system");
var appSettings = require("tns-core-modules/application-settings");
var dialogs = require("tns-core-modules/ui/dialogs");
var SearchComponent = /** @class */ (function () {
    function SearchComponent(changeDetectorRef, databaseService, dataFacadeService, traceWriterService) {
        this.changeDetectorRef = changeDetectorRef;
        this.databaseService = databaseService;
        this.dataFacadeService = dataFacadeService;
        this.traceWriterService = traceWriterService;
        this.pending = false;
        this.rangeText = "AUTO STOP PRZY WARTOSCI: " + appSettings.getNumber('range', 75);
        // Use the constructor to inject services.
    }
    SearchComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.auto = appSettings.getBoolean('auto', false);
        this.bgSource = appSettings.getBoolean('bgsource', false);
        this.rangeText = "AUTO STOP PRZY WARTOSCI: " + appSettings.getNumber('range', 75) + "MG/DL";
        this.traceWriterService.subscribe(function (_a) {
            var message = _a.message, date = _a.date, category = _a.category, messageType = _a.messageType;
            _this.databaseService.insertLogs(date, message, messageType, category);
        });
        this.sendDatatoNightscout7().then(function () {
            return console.log(_this.nsUrl2 + "fffffffffffff3333333f");
        });
    };
    SearchComponent.prototype.getBGRange = function () {
        var _this = this;
        dialogs.prompt({
            title: "Podaj wartość przy jakiej ma zostać wyłączona pompa",
            message: "Wartość graniczna to:",
            okButtonText: "OK",
            cancelButtonText: "Cancel",
            inputType: dialogs.inputType.number
        }).then(function (r) {
            console.log("Dialog closed!" + r.result + ", A TO TEKST:" + r.text);
            _this.range = Number(r.text);
            if (_this.range < 75 || _this.range > 110) {
                dialogs.alert({ message: "UWAGA WARTOŚC Z POZA ZAKRESU: 75 - 110 MG/DL", okButtonText: "OK" });
            }
            else {
                appSettings.setNumber('range', _this.range);
                _this.rangeText = "AUTO STOP PRZY WARTOŚCI: " + _this.range + "MG/DL";
            }
        });
    };
    SearchComponent.prototype.sendLogs = function () {
        var documents = fs.path.join(android.os.Environment.getExternalStorageDirectory().getAbsolutePath().toString());
        var myFolder = fs.Folder.fromPath(documents);
        var myFile = myFolder.getFile("my.txt");
        var a = Runtime.getRuntime().exec('logcat -v time -f /sdcard/my.txt -d');
        console.log("to ta wielkosc pliku: " + myFile.size);
        if (myFile.size > 5000000) {
            myFile.remove();
        }
        var u = setInterval(function () {
            if (a.isAlive() === false) {
                clearInterval(u);
                console.log("CIOSs");
                Permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE).then(function () {
                    return nativescript_email_1.compose({
                        subject: "Debug med-link-ui",
                        body: "aReduced2",
                        to: ["jrkf@o2.pl"],
                        attachments: [{
                                mimeType: 'text',
                                path: myFile.path,
                                fileName: 'my.txt'
                            }]
                    });
                });
            }
            else {
                console.log("BAM BAM");
            }
        }, 500);
    };
    SearchComponent.prototype.Zapisz = function () {
        var _this = this;
        console.log("aaaaaa" + this.nsUrl);
        var sha1 = require("sha1");
        this.databaseService.insertNS(this.nsUrl, sha1(this.nsKey), this.nsKey);
        console.log("NS URL: " + this.nsUrl + " ddddddddddd " + this.nsKey);
        this.sendDatatoNightscout6().then(function () {
            return console.log(_this.slowo + "aRRRRRRRRRR");
        });
        if (this.nsUrl.substring(0, 8).toUpperCase() !== "HTTPS://" ||
            this.nsUrl.substring(this.nsUrl.length - 1, this.nsUrl.length) === "/") {
            this.slowo2 = "ZŁY ADRES URL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!";
        }
        else {
            this.slowo2 = "OK! ";
        }
    };
    SearchComponent.prototype.onCheckedChangeAuto = function (args) {
        var mySwitch = args.object;
        var isChecked = mySwitch.checked; // boolean
        if (isChecked === true) {
            appSettings.setBoolean("auto", true);
            this.auto = appSettings.getBoolean('auto');
        }
        else {
            appSettings.setBoolean("auto", false);
            this.auto = appSettings.getBoolean('auto');
        }
    };
    SearchComponent.prototype.onCheckedChangeSource = function (args) {
        var mySwitch = args.object;
        var isChecked = mySwitch.checked; // boolean
        if (isChecked === true) {
            appSettings.setBoolean("bgsource", true);
            this.bgSource = appSettings.getBoolean('bgsource');
        }
        else {
            appSettings.setBoolean("bgsource", false);
            this.bgSource = appSettings.getBoolean('bgsource');
        }
    };
    SearchComponent.prototype.sendDatatoNightscout6 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getNSData().subscribe(function (g) {
                g.map(function (bol) {
                    console.log(bol.http.toString() + "JJJJJJJ" + bol.secret.toString());
                    _this.slowo =
                        _this.slowo2 +
                            "  " +
                            bol.http.toString() +
                            " " +
                            bol.secret.toString();
                });
                console.log("as" + _this.slowo);
                resolve(), reject();
            });
        });
    };
    SearchComponent.prototype.sendDatatoNightscout7 = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getNSData().subscribe(function (g) {
                g.map(function (bol) {
                    console.log(bol.http.toString() + "66666666666" + bol.secret.toString());
                    _this.nsUrl2 = bol.http.toString();
                    _this.nsKey2 = bol.hash.toString();
                });
                console.log("as" + _this.nsUrl2);
                resolve(), reject();
            });
        });
    };
    SearchComponent.prototype.setNS = function (arg) {
        console.log("setttNS");
        console.log(arg.text);
        this.nsUrl = arg.text;
    };
    SearchComponent.prototype.setNSurl = function (arg) {
        console.log("setttNSUURRL");
        console.log(arg.text);
        this.nsKey = arg.text;
    };
    SearchComponent.prototype.getNSData = function () {
        return this.databaseService.NSconf().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                http: a[0],
                secret: a[1],
                hash: a[2]
            }); });
        }));
    };
    SearchComponent = __decorate([
        core_1.Component({
            selector: "Search",
            moduleId: module.id,
            templateUrl: "./search.component.html",
            styleUrls: ["./search.component.scss"]
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef,
            database_service_1.DatabaseService,
            data_facade_service_1.DataFacadeService,
            trace_writer_service_1.TraceWriterService])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBcUU7QUFDckUseURBQTZDO0FBQzdDLHNEQUF3RDtBQUV4RCw0Q0FBcUM7QUFDckMsd0VBQXFFO0FBQ3JFLGtFQUFnRTtBQUNoRSwwRUFBdUU7QUFDdkUsSUFBTyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDbkMsaURBQW1EO0FBR25ELG1FQUFxRTtBQUNyRSxxREFBdUQ7QUFTdkQ7SUFlRSx5QkFDVSxpQkFBb0MsRUFDcEMsZUFBZ0MsRUFDaEMsaUJBQW9DLEVBQ3BDLGtCQUFzQztRQUh0QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUNoQyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQW1CO1FBQ3BDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUFYaEQsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUtoQixjQUFTLEdBQVcsMkJBQTJCLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFRbkYsMENBQTBDO0lBQzVDLENBQUM7SUFDRCxrQ0FBUSxHQUFSO1FBQUEsaUJBWUM7UUFYQyxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFNBQVMsR0FBRywyQkFBMkIsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDNUYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFNBQVMs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QyxDQUFDO2FBQ1gsQ0FBQyxFQUptQixDQUluQixDQUFDLENBQUM7UUFDTixDQUFDLENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQTdMVSxlQUFlO1FBTjNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsUUFBUTtZQUNsQixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHlCQUF5QjtZQUN0QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QyxDQUFDO3lDQWlCNkIsd0JBQWlCO1lBQ25CLGtDQUFlO1lBQ2IsdUNBQWlCO1lBQ2hCLHlDQUFrQjtPQW5CckMsZUFBZSxDQThMM0I7SUFBRCxzQkFBQztDQUFBLEFBOUxELElBOExDO0FBOUxZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IGNvbXBvc2UgfSBmcm9tICduYXRpdmVzY3JpcHQtZW1haWwnO1xyXG5pbXBvcnQgKiBhcyBQZXJtaXNzaW9ucyBmcm9tICduYXRpdmVzY3JpcHQtcGVybWlzc2lvbnMnO1xyXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgRGF0YUZhY2FkZVNlcnZpY2UgfSBmcm9tICd+L2FwcC9zaGFyZWQvZGF0YS1mYWNhZGUuc2VydmljZSc7XHJcbmltcG9ydCB7IERhdGFiYXNlU2VydmljZSB9IGZyb20gJ34vYXBwL3NoYXJlZC9kYXRhYmFzZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgVHJhY2VXcml0ZXJTZXJ2aWNlIH0gZnJvbSAnfi9hcHAvc2hhcmVkL3RyYWNlLXdyaXRlci5zZXJ2aWNlJztcclxuaW1wb3J0IFJ1bnRpbWUgPSBqYXZhLmxhbmcuUnVudGltZTtcclxuaW1wb3J0ICogYXMgZnMgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZmlsZS1zeXN0ZW1cIjtcclxuaW1wb3J0IHsgRXZlbnREYXRhIH0gZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvZGF0YS9vYnNlcnZhYmxlXCI7XHJcbmltcG9ydCB7IFN3aXRjaCB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL3N3aXRjaFwiO1xyXG5pbXBvcnQgKiBhcyBhcHBTZXR0aW5ncyBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xyXG5pbXBvcnQgKiBhcyBkaWFsb2dzIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL3VpL2RpYWxvZ3NcIjtcclxuaW1wb3J0IHsgdG9OdW1iZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2NvbXBpbGVyLWNsaS9zcmMvZGlhZ25vc3RpY3MvdHlwZXNjcmlwdF92ZXJzaW9uXCI7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogXCJTZWFyY2hcIixcclxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxyXG4gIHRlbXBsYXRlVXJsOiBcIi4vc2VhcmNoLmNvbXBvbmVudC5odG1sXCIsXHJcbiAgc3R5bGVVcmxzOiBbXCIuL3NlYXJjaC5jb21wb25lbnQuc2Nzc1wiXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2VhcmNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBzbG93bzogc3RyaW5nO1xyXG4gIHNsb3dvMjogc3RyaW5nO1xyXG4gIG5zVXJsOiBzdHJpbmc7XHJcbiAgbnNVcmwyOiBzdHJpbmc7XHJcbiAgbnNLZXk6IHN0cmluZztcclxuICBuc0tleTI6IHN0cmluZztcclxuICBjYXJiczogc3RyaW5nO1xyXG4gIHBlbmRpbmcgPSBmYWxzZTtcclxuICBhUmVkdWNlZDI6IHN0cmluZztcclxuICBhdXRvOiBib29sZWFuO1xyXG4gIGJnU291cmNlOiBib29sZWFuO1xyXG4gIHJhbmdlOiBudW1iZXI7XHJcbiAgcmFuZ2VUZXh0OiBzdHJpbmcgPSBcIkFVVE8gU1RPUCBQUlpZIFdBUlRPU0NJOiBcIiArIGFwcFNldHRpbmdzLmdldE51bWJlcigncmFuZ2UnLCA3NSk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIGRhdGFiYXNlU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBkYXRhRmFjYWRlU2VydmljZTogRGF0YUZhY2FkZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHRyYWNlV3JpdGVyU2VydmljZTogVHJhY2VXcml0ZXJTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICAvLyBVc2UgdGhlIGNvbnN0cnVjdG9yIHRvIGluamVjdCBzZXJ2aWNlcy5cclxuICB9XHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmF1dG8gPSBhcHBTZXR0aW5ncy5nZXRCb29sZWFuKCdhdXRvJywgZmFsc2UpO1xyXG4gICAgdGhpcy5iZ1NvdXJjZSA9IGFwcFNldHRpbmdzLmdldEJvb2xlYW4oJ2Jnc291cmNlJywgZmFsc2UpO1xyXG4gICAgdGhpcy5yYW5nZVRleHQgPSBcIkFVVE8gU1RPUCBQUlpZIFdBUlRPU0NJOiBcIiArIGFwcFNldHRpbmdzLmdldE51bWJlcigncmFuZ2UnLCA3NSkgKyBcIk1HL0RMXCI7XHJcbiAgICB0aGlzLnRyYWNlV3JpdGVyU2VydmljZS5zdWJzY3JpYmUoXHJcbiAgICAgICh7IG1lc3NhZ2UsIGRhdGUsIGNhdGVnb3J5LCBtZXNzYWdlVHlwZSB9KSA9PiB7XHJcbiAgICAgICAgdGhpcy5kYXRhYmFzZVNlcnZpY2UuaW5zZXJ0TG9ncyhkYXRlLCBtZXNzYWdlLCBtZXNzYWdlVHlwZSwgY2F0ZWdvcnkpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gICAgdGhpcy5zZW5kRGF0YXRvTmlnaHRzY291dDcoKS50aGVuKCgpID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMubnNVcmwyICsgXCJmZmZmZmZmZmZmZmZmMzMzMzMzM2ZcIilcclxuICAgICk7XHJcbiAgfVxyXG4gIGdldEJHUmFuZ2UoKXtcclxuICAgIGRpYWxvZ3MucHJvbXB0KHtcclxuICAgICAgdGl0bGU6IFwiUG9kYWogd2FydG/Fm8SHIHByenkgamFraWVqIG1hIHpvc3RhxIcgd3nFgsSFY3pvbmEgcG9tcGFcIixcclxuICAgICAgbWVzc2FnZTogXCJXYXJ0b8WbxIcgZ3Jhbmljem5hIHRvOlwiLFxyXG4gICAgICBva0J1dHRvblRleHQ6IFwiT0tcIixcclxuICAgICAgY2FuY2VsQnV0dG9uVGV4dDogXCJDYW5jZWxcIixcclxuICAgICAgaW5wdXRUeXBlOiBkaWFsb2dzLmlucHV0VHlwZS5udW1iZXJcclxuICAgIH0pLnRoZW4ociA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiRGlhbG9nIGNsb3NlZCFcIiArIHIucmVzdWx0ICsgXCIsIEEgVE8gVEVLU1Q6XCIgKyByLnRleHQpO1xyXG4gICAgICB0aGlzLnJhbmdlID0gTnVtYmVyKHIudGV4dCk7XHJcbiAgICAgIGlmKHRoaXMucmFuZ2UgPCA3NSB8fCB0aGlzLnJhbmdlID4gMTEwKXtcclxuIGRpYWxvZ3MuYWxlcnQoe21lc3NhZ2U6IFwiVVdBR0EgV0FSVE/FmkMgWiBQT1pBIFpBS1JFU1U6IDc1IC0gMTEwIE1HL0RMXCIsIG9rQnV0dG9uVGV4dDogXCJPS1wifSk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgYXBwU2V0dGluZ3Muc2V0TnVtYmVyKCdyYW5nZScsIHRoaXMucmFuZ2UpO1xyXG4gICAgICAgIHRoaXMucmFuZ2VUZXh0ID0gXCJBVVRPIFNUT1AgUFJaWSBXQVJUT8WaQ0k6IFwiICsgdGhpcy5yYW5nZSArIFwiTUcvRExcIjtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG59XHJcblxyXG4gIHNlbmRMb2dzKCkge1xyXG4gICAgY29uc3QgZG9jdW1lbnRzID0gZnMucGF0aC5qb2luKGFuZHJvaWQub3MuRW52aXJvbm1lbnQuZ2V0RXh0ZXJuYWxTdG9yYWdlRGlyZWN0b3J5KCkuZ2V0QWJzb2x1dGVQYXRoKCkudG9TdHJpbmcoKSk7XHJcbiAgICBjb25zdCBteUZvbGRlciA9IGZzLkZvbGRlci5mcm9tUGF0aChkb2N1bWVudHMpO1xyXG4gICAgY29uc3QgbXlGaWxlID0gbXlGb2xkZXIuZ2V0RmlsZShcIm15LnR4dFwiKTtcclxuICAgIGNvbnN0IGEgPSBSdW50aW1lLmdldFJ1bnRpbWUoKS5leGVjKCdsb2djYXQgLXYgdGltZSAtZiAvc2RjYXJkL215LnR4dCAtZCcpO1xyXG4gICAgY29uc29sZS5sb2coXCJ0byB0YSB3aWVsa29zYyBwbGlrdTogXCIgKyBteUZpbGUuc2l6ZSk7XHJcbiAgICBpZiAobXlGaWxlLnNpemUgPiA1MDAwMDAwIClcclxuICAgIHtcclxuICAgICAgbXlGaWxlLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHUgPSBzZXRJbnRlcnZhbCggKCkgPT4ge1xyXG4gICAgaWYgKGEuaXNBbGl2ZSgpID09PSBmYWxzZSl7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiQ0lPU3NcIik7XHJcbiAgICAgIFBlcm1pc3Npb25zLnJlcXVlc3RQZXJtaXNzaW9uKFxyXG4gICAgICAgIGFuZHJvaWQuTWFuaWZlc3QucGVybWlzc2lvbi5XUklURV9FWFRFUk5BTF9TVE9SQUdFLFxyXG4gICAgICApLnRoZW4oKCkgPT5cclxuICAgICAgICBjb21wb3NlKHtcclxuICAgICAgICAgIHN1YmplY3Q6IFwiRGVidWcgbWVkLWxpbmstdWlcIixcclxuICAgICAgICAgIGJvZHk6IFwiYVJlZHVjZWQyXCIsXHJcbiAgICAgICAgICB0bzogW1wianJrZkBvMi5wbFwiXSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2htZW50czpcclxuICAgICAgICAgICAgICAgICAgICAgIFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbWVUeXBlOiAndGV4dCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhdGg6IG15RmlsZS5wYXRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlTmFtZTogJ215LnR4dCdcclxuICAgICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgfSlcclxuICAgICAgKVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiQkFNIEJBTVwiKTtcclxuICAgIH1cclxuICAgIH0sIDUwMCk7XHJcbiAgfVxyXG5cclxuICBaYXBpc3ooKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImFhYWFhYVwiICsgdGhpcy5uc1VybCk7XHJcbiAgICBjb25zdCBzaGExID0gcmVxdWlyZShcInNoYTFcIik7XHJcbiAgICB0aGlzLmRhdGFiYXNlU2VydmljZS5pbnNlcnROUyh0aGlzLm5zVXJsLCBzaGExKHRoaXMubnNLZXkpLCB0aGlzLm5zS2V5KTtcclxuICAgIGNvbnNvbGUubG9nKFwiTlMgVVJMOiBcIiArIHRoaXMubnNVcmwgKyBcIiBkZGRkZGRkZGRkZCBcIiArIHRoaXMubnNLZXkpO1xyXG4gICAgdGhpcy5zZW5kRGF0YXRvTmlnaHRzY291dDYoKS50aGVuKCgpID0+XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc2xvd28gKyBcImFSUlJSUlJSUlJSXCIpXHJcbiAgICApO1xyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLm5zVXJsLnN1YnN0cmluZygwLCA4KS50b1VwcGVyQ2FzZSgpICE9PSBcIkhUVFBTOi8vXCIgfHxcclxuICAgICAgdGhpcy5uc1VybC5zdWJzdHJpbmcodGhpcy5uc1VybC5sZW5ndGggLSAxLCB0aGlzLm5zVXJsLmxlbmd0aCkgPT09IFwiL1wiXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5zbG93bzIgPSBcIlrFgVkgQURSRVMgVVJMICEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhIVwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zbG93bzIgPSBcIk9LISBcIjtcclxuICAgIH1cclxuICB9XHJcbiAgb25DaGVja2VkQ2hhbmdlQXV0byhhcmdzOiBFdmVudERhdGEpIHtcclxuICAgIGNvbnN0IG15U3dpdGNoID0gYXJncy5vYmplY3QgYXMgU3dpdGNoO1xyXG4gICAgY29uc3QgaXNDaGVja2VkID0gbXlTd2l0Y2guY2hlY2tlZDsgLy8gYm9vbGVhblxyXG4gICAgaWYgKGlzQ2hlY2tlZCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgYXBwU2V0dGluZ3Muc2V0Qm9vbGVhbihcImF1dG9cIiwgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuYXV0byA9IGFwcFNldHRpbmdzLmdldEJvb2xlYW4oJ2F1dG8nKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBhcHBTZXR0aW5ncy5zZXRCb29sZWFuKFwiYXV0b1wiLCBmYWxzZSk7XHJcbiAgICAgIHRoaXMuYXV0byA9IGFwcFNldHRpbmdzLmdldEJvb2xlYW4oJ2F1dG8nKTtcclxuICAgIH1cclxuICAgIH1cclxuICBvbkNoZWNrZWRDaGFuZ2VTb3VyY2UoYXJnczogRXZlbnREYXRhKSB7XHJcbiAgICBjb25zdCBteVN3aXRjaCA9IGFyZ3Mub2JqZWN0IGFzIFN3aXRjaDtcclxuICAgIGNvbnN0IGlzQ2hlY2tlZCA9IG15U3dpdGNoLmNoZWNrZWQ7IC8vIGJvb2xlYW5cclxuICAgIGlmIChpc0NoZWNrZWQgPT09IHRydWUpIHtcclxuICAgICAgYXBwU2V0dGluZ3Muc2V0Qm9vbGVhbihcImJnc291cmNlXCIsIHRydWUpO1xyXG4gICAgICB0aGlzLmJnU291cmNlID0gYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYmdzb3VyY2UnKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBhcHBTZXR0aW5ncy5zZXRCb29sZWFuKFwiYmdzb3VyY2VcIiwgZmFsc2UpO1xyXG4gICAgICB0aGlzLmJnU291cmNlID0gYXBwU2V0dGluZ3MuZ2V0Qm9vbGVhbignYmdzb3VyY2UnKTtcclxuICAgIH1cclxuICB9XHJcbiAgc2VuZERhdGF0b05pZ2h0c2NvdXQ2KCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5nZXROU0RhdGEoKS5zdWJzY3JpYmUoZyA9PiB7XHJcbiAgICAgICAgZy5tYXAoYm9sID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGJvbC5odHRwLnRvU3RyaW5nKCkgKyBcIkpKSkpKSkpcIiArIGJvbC5zZWNyZXQudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICB0aGlzLnNsb3dvID1cclxuICAgICAgICAgICAgdGhpcy5zbG93bzIgK1xyXG4gICAgICAgICAgICBcIiAgXCIgK1xyXG4gICAgICAgICAgICBib2wuaHR0cC50b1N0cmluZygpICtcclxuICAgICAgICAgICAgXCIgXCIgK1xyXG4gICAgICAgICAgICBib2wuc2VjcmV0LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJhc1wiICsgdGhpcy5zbG93byk7XHJcbiAgICAgICAgcmVzb2x2ZSgpLCByZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgc2VuZERhdGF0b05pZ2h0c2NvdXQ3KCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5nZXROU0RhdGEoKS5zdWJzY3JpYmUoZyA9PiB7XHJcbiAgICAgICAgZy5tYXAoYm9sID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKFxyXG4gICAgICAgICAgICBib2wuaHR0cC50b1N0cmluZygpICsgXCI2NjY2NjY2NjY2NlwiICsgYm9sLnNlY3JldC50b1N0cmluZygpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgdGhpcy5uc1VybDIgPSBib2wuaHR0cC50b1N0cmluZygpO1xyXG4gICAgICAgICAgdGhpcy5uc0tleTIgPSBib2wuaGFzaC50b1N0cmluZygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiYXNcIiArIHRoaXMubnNVcmwyKTtcclxuICAgICAgICByZXNvbHZlKCksIHJlamVjdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBzZXROUyhhcmcpIHtcclxuICAgIGNvbnNvbGUubG9nKFwic2V0dHROU1wiKTtcclxuICAgIGNvbnNvbGUubG9nKGFyZy50ZXh0KTtcclxuICAgIHRoaXMubnNVcmwgPSBhcmcudGV4dDtcclxuICB9XHJcbiAgc2V0TlN1cmwoYXJnKSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInNldHR0TlNVVVJSTFwiKTtcclxuICAgIGNvbnNvbGUubG9nKGFyZy50ZXh0KTtcclxuICAgIHRoaXMubnNLZXkgPSBhcmcudGV4dDtcclxuICB9XHJcbiAgZ2V0TlNEYXRhKCk6IE9ic2VydmFibGU8XHJcbiAgICBBcnJheTx7IGh0dHA6IHN0cmluZzsgc2VjcmV0OiBzdHJpbmc7IGhhc2g6IHN0cmluZyB9PlxyXG4gID4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YWJhc2VTZXJ2aWNlLk5TY29uZigpLnBpcGUoXHJcbiAgICAgIG1hcChyb3dzID0+IHtcclxuICAgICAgICByZXR1cm4gcm93cy5tYXAoYSA9PiAoe1xyXG4gICAgICAgICAgaHR0cDogYVswXSxcclxuICAgICAgICAgIHNlY3JldDogYVsxXSxcclxuICAgICAgICAgIGhhc2g6IGFbMl1cclxuICAgICAgICB9KSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxufVxyXG4iXX0=