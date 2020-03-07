"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var database_service_1 = require("~/app/shared/database.service");
var NightscoutApiService = /** @class */ (function () {
    function NightscoutApiService(httpClient, databaseService) {
        this.httpClient = httpClient;
        this.databaseService = databaseService;
        //secret = 'd6026bb45e7efd38de82680c75d31cf7f7a6a1e3';
        this.secret = '258628a55f1370569738e7da6d135c61dcaea7c9';
        this.device = 'Med-Link';
        this.timezone = '+02:00';
        this.http = '';
        this.hash = '';
    }
    NightscoutApiService.prototype.getNSData = function () {
        return this.databaseService.NSconf().pipe(operators_1.map(function (rows) {
            return rows.map(function (a) { return ({
                http: a[0],
                secret: a[1]
            }); });
        }));
    };
    NightscoutApiService.prototype.getConfig = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getNSData().subscribe(function (g) {
                g.map(function (bol) {
                    _this.http = bol.http.toString();
                    _this.hash = bol.secret.toString();
                });
                console.log("TO JEST API I SECRET Z BAZY aaaaaaaassssssss" + _this.http + _this.hash);
                resolve(),
                    reject();
            });
        });
    };
    NightscoutApiService.prototype.sendNewBG = function (glucoses) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (glucoses.length >= 1) {
                console.log("DLUGOSC API KOMUNIKATU:  " + glucoses.length);
                _this.httpClient
                    .post(_this.http + '/api/v1/entries', glucoses.map(function (glucose) { return ({
                    device: _this.device,
                    secret: _this.hash,
                    sgv: glucose.value,
                    date: +glucose.date,
                    direction: glucose.old
                }); })).subscribe(resolve, reject);
            }
            else {
                console.log("Brak informacji o cukrze cukier!!");
                console.log("DLUGOSC API KOMUNIKATU:  " + glucoses.length);
                resolve();
            }
        });
    };
    NightscoutApiService.prototype.sendNewBol = function (treatments) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.httpClient
                .post(_this.http + '/api/v1/treatments', treatments.map(function (bol) { return ({
                enteredBy: _this.device,
                secret: _this.hash,
                insulin: bol.value,
                created_at: bol.date
            }); })).subscribe(resolve, reject);
        });
    };
    NightscoutApiService.prototype.getBGfromNs = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getConfig().then(function () { return _this.httpClient.get(_this.http + '/api/v1/entries.json?count=1').subscribe(resolve, reject); });
        });
    };
    NightscoutApiService.prototype.sendNewTempBasal = function (tempbasal) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (tempbasal.length >= 1) {
                _this.httpClient
                    .post(_this.http + '/api/v1/treatments', tempbasal.map(function (bol) { return ({
                    enteredBy: _this.device,
                    secret: _this.hash,
                    duration: bol.minutes,
                    created_at: bol.dateString,
                    percent: bol.percentsOfBasal,
                    rate: 0.7,
                    eventType: 'Temp Basal',
                    timestamp: new Date()
                }); })).subscribe(resolve, reject);
            }
            else {
                console.log("Brak TDP - OK");
                console.log("DLUGOSC API KOMUNIKATU:  " + tempbasal.length);
                resolve();
            }
        });
    };
    NightscoutApiService.prototype.sendNewDevicestatus = function (deviceStatus) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getConfig().then(function () {
                return _this.httpClient
                    .post(_this.http + '/api/v1/devicestatus', deviceStatus.map(function (bol) { return ({
                    device: _this.device,
                    secret: _this.hash,
                    created_at: new Date(),
                    pump: {
                        clock: bol.dateString,
                        reservoir: bol.reservoir,
                        status: { status: bol.status, timestamp: 1557061755 },
                        extended: { version: '1.0', ActiveProfile: 'medlink' },
                        battery: { voltage: bol.voltage.toString().substring(0, 4) }
                    },
                    uploaderBattery: bol.percent
                }); })).subscribe(resolve, reject);
            });
        });
    };
    NightscoutApiService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient,
            database_service_1.DatabaseService])
    ], NightscoutApiService);
    return NightscoutApiService;
}());
exports.NightscoutApiService = NightscoutApiService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmlnaHRzY291dC1hcGkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5pZ2h0c2NvdXQtYXBpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBcUU7QUFDckUsc0NBQTJDO0FBRTNDLDRDQUFxQztBQUlyQyxrRUFBZ0U7QUFNaEU7SUFRRSw4QkFBb0IsVUFBc0IsRUFDbEMsZUFBZ0M7UUFEcEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNsQyxvQkFBZSxHQUFmLGVBQWUsQ0FBaUI7UUFSeEMsc0RBQXNEO1FBQ3RELFdBQU0sR0FBRywwQ0FBMEMsQ0FBQztRQUNwRCxXQUFNLEdBQUcsVUFBVSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxRQUFRLENBQUM7UUFDcEIsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQUNWLFNBQUksR0FBRyxFQUFFLENBQUM7SUFJVixDQUFDO0lBRUQsd0NBQVMsR0FBVDtRQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQ3ZDLGVBQUcsQ0FBQyxVQUFBLElBQUk7WUFDTixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDO2dCQUNwQixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNiLENBQUMsRUFIbUIsQ0FHbkIsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCx3Q0FBUyxHQUFUO1FBQUEsaUJBWUM7UUFYQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDakMsS0FBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHO29CQUNQLEtBQUksQ0FBQyxJQUFJLEdBQUcsR0FB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TUFBTSxFQUFFLEtBQUksQ0FBQyxNQUFNO29CQUNuQixNQUFNLEVBQUUsS0FBSSxDQUFDLElBQUk7b0JBQ2pCLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRTtvQkFDdEIsSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxHQUFHLENBQUMsVUFBVTt3QkFDckIsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTO3dCQUN4QixNQUFNLEVBQUUsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFO3dCQUNyRCxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUU7d0JBQ3RELE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7cUJBQzdEO29CQUNELGVBQWUsRUFBRSxHQUFHLENBQUMsT0FBTztpQkFDN0IsQ0FBQyxFQVpzQixDQVl0QixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQztZQWZuQyxDQWVtQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBNUhZLG9CQUFvQjtRQUhoQyxpQkFBVSxDQUFDO1lBQ1YsVUFBVSxFQUFFLE1BQU07U0FDbkIsQ0FBQzt5Q0FTZ0MsaUJBQVU7WUFDakIsa0NBQWU7T0FUN0Isb0JBQW9CLENBNEgvQjtJQUFELDJCQUFDO0NBQUEsQUE1SEYsSUE0SEU7QUE1SFcsb0RBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IGtub3duRm9sZGVycyB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvZmlsZS1zeXN0ZW0nO1xyXG5pbXBvcnQgeyByZXNldFByb2ZpbGVzIH0gZnJvbSAndG5zLWNvcmUtbW9kdWxlcy9wcm9maWxpbmcnO1xyXG5pbXBvcnQgeyBuaWdodFNjb3V0UGF0aCB9IGZyb20gJ34vYXBwL2Vudic7XHJcbmltcG9ydCB7IERhdGFiYXNlU2VydmljZSB9IGZyb20gJ34vYXBwL3NoYXJlZC9kYXRhYmFzZS5zZXJ2aWNlJztcclxuaW1wb3J0IHRlbXAgPSBrbm93bkZvbGRlcnMudGVtcDtcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5pZ2h0c2NvdXRBcGlTZXJ2aWNlIHtcclxuICAvL3NlY3JldCA9ICdkNjAyNmJiNDVlN2VmZDM4ZGU4MjY4MGM3NWQzMWNmN2Y3YTZhMWUzJztcclxuICBzZWNyZXQgPSAnMjU4NjI4YTU1ZjEzNzA1Njk3MzhlN2RhNmQxMzVjNjFkY2FlYTdjOSc7XHJcbiAgZGV2aWNlID0gJ01lZC1MaW5rJztcclxuICB0aW1lem9uZSA9ICcrMDI6MDAnO1xyXG4gIGh0dHAgPSAnJztcclxuICBoYXNoID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cENsaWVudDogSHR0cENsaWVudCxcclxuICBwcml2YXRlIGRhdGFiYXNlU2VydmljZTogRGF0YWJhc2VTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBnZXROU0RhdGEoKTogT2JzZXJ2YWJsZTxBcnJheTx7IGh0dHA6IHN0cmluZzsgc2VjcmV0OiBzdHJpbmcgfT4+IHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFiYXNlU2VydmljZS5OU2NvbmYoKS5waXBlKFxyXG4gICAgICBtYXAocm93cyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJvd3MubWFwKGEgPT4gKHtcclxuICAgICAgICAgIGh0dHA6IGFbMF0sXHJcbiAgICAgICAgICBzZWNyZXQ6IGFbMV1cclxuICAgICAgICB9KSk7XHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29uZmlnKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5nZXROU0RhdGEoKS5zdWJzY3JpYmUoZyA9PiB7XHJcbiAgICAgICAgZy5tYXAoYm9sID0+IHtcclxuICAgICAgICAgIHRoaXMuaHR0cCA9IGJvbC5odHRwLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICB0aGlzLmhhc2ggPSBib2wuc2VjcmV0LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJUTyBKRVNUIEFQSSBJIFNFQ1JFVCBaIEJBWlkgYWFhYWFhYWFzc3Nzc3Nzc1wiICsgdGhpcy5odHRwICsgdGhpcy5oYXNoKTtcclxuICAgICAgICByZXNvbHZlKCksXHJcbiAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2VuZE5ld0JHKGdsdWNvc2VzOiBBcnJheTx7IHZhbHVlOiBudW1iZXI7IGRhdGU6IERhdGU7IG9sZDogc3RyaW5nIH0+KSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBpZiAoZ2x1Y29zZXMubGVuZ3RoID49IDEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRMVUdPU0MgQVBJIEtPTVVOSUtBVFU6ICBcIiArIGdsdWNvc2VzLmxlbmd0aCk7XHJcbiAgICAgICAgdGhpcy5odHRwQ2xpZW50XHJcbiAgICAgICAgICAucG9zdChcclxuICAgICAgICAgICAgdGhpcy5odHRwICsgJy9hcGkvdjEvZW50cmllcycsXHJcbiAgICAgICAgICAgIGdsdWNvc2VzLm1hcChnbHVjb3NlID0+ICh7XHJcbiAgICAgICAgICAgICAgZGV2aWNlOiB0aGlzLmRldmljZSxcclxuICAgICAgICAgICAgICBzZWNyZXQ6IHRoaXMuaGFzaCxcclxuICAgICAgICAgICAgICBzZ3Y6IGdsdWNvc2UudmFsdWUsXHJcbiAgICAgICAgICAgICAgZGF0ZTogK2dsdWNvc2UuZGF0ZSxcclxuICAgICAgICAgICAgICBkaXJlY3Rpb246IGdsdWNvc2Uub2xkXHJcbiAgICAgICAgICAgIH0pKSkuc3Vic2NyaWJlKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJCcmFrIGluZm9ybWFjamkgbyBjdWtyemUgY3VraWVyISFcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJETFVHT1NDIEFQSSBLT01VTklLQVRVOiAgXCIgKyBnbHVjb3Nlcy5sZW5ndGgpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kTmV3Qm9sKHRyZWF0bWVudHM6IEFycmF5PHsgdmFsdWU6IG51bWJlcjsgZGF0ZTogRGF0ZSB9Pikge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgdGhpcy5odHRwQ2xpZW50XHJcbiAgICAgICAgLnBvc3QoXHJcbiAgICAgICAgICB0aGlzLmh0dHAgKyAnL2FwaS92MS90cmVhdG1lbnRzJyxcclxuICAgICAgICAgIHRyZWF0bWVudHMubWFwKGJvbCA9PiAoe1xyXG4gICAgICAgICAgICBlbnRlcmVkQnk6IHRoaXMuZGV2aWNlLFxyXG4gICAgICAgICAgICBzZWNyZXQ6IHRoaXMuaGFzaCxcclxuICAgICAgICAgICAgaW5zdWxpbjogYm9sLnZhbHVlLFxyXG4gICAgICAgICAgICBjcmVhdGVkX2F0OiBib2wuZGF0ZVxyXG4gICAgICAgICAgfSkpKS5zdWJzY3JpYmUocmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBnZXRCR2Zyb21OcygpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHRoaXMuZ2V0Q29uZmlnKCkudGhlbigoKSA9PiB0aGlzLmh0dHBDbGllbnQuZ2V0KHRoaXMuaHR0cCArICcvYXBpL3YxL2VudHJpZXMuanNvbj9jb3VudD0xJykuc3Vic2NyaWJlKHJlc29sdmUsIHJlamVjdCkpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmROZXdUZW1wQmFzYWwodGVtcGJhc2FsOiBBcnJheTx7IHBlcmNlbnRzT2ZCYXNhbDogbnVtYmVyOyBtaW51dGVzOiBudW1iZXI7IGRhdGVTdHJpbmc6IERhdGUgfT4pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGlmICh0ZW1wYmFzYWwubGVuZ3RoID49IDEpIHtcclxuICAgICAgdGhpcy5odHRwQ2xpZW50XHJcbiAgICAgICAgLnBvc3QoXHJcbiAgICAgICAgICB0aGlzLmh0dHAgKyAnL2FwaS92MS90cmVhdG1lbnRzJyxcclxuICAgICAgICAgIHRlbXBiYXNhbC5tYXAoYm9sID0+ICh7XHJcbiAgICAgICAgICAgIGVudGVyZWRCeTogdGhpcy5kZXZpY2UsXHJcbiAgICAgICAgICAgIHNlY3JldDogdGhpcy5oYXNoLFxyXG4gICAgICAgICAgICBkdXJhdGlvbjogYm9sLm1pbnV0ZXMsXHJcbiAgICAgICAgICAgIGNyZWF0ZWRfYXQ6IGJvbC5kYXRlU3RyaW5nLFxyXG4gICAgICAgICAgICBwZXJjZW50OiBib2wucGVyY2VudHNPZkJhc2FsLFxyXG4gICAgICAgICAgICByYXRlOiAwLjcsXHJcbiAgICAgICAgICAgIGV2ZW50VHlwZTogJ1RlbXAgQmFzYWwnLFxyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKClcclxuICAgICAgICAgIH0pKSkuc3Vic2NyaWJlKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJCcmFrIFREUCAtIE9LXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRExVR09TQyBBUEkgS09NVU5JS0FUVTogIFwiICsgdGVtcGJhc2FsLmxlbmd0aCk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmROZXdEZXZpY2VzdGF0dXMoZGV2aWNlU3RhdHVzOiBBcnJheTx7IHJlc2Vydm9pcjogbnVtYmVyOyB2b2x0YWdlOiBudW1iZXI7IGRhdGVTdHJpbmc6IERhdGU7IHBlcmNlbnQ6IG51bWJlcjsgc3RhdHVzOiBzdHJpbmcgfT4pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLmdldENvbmZpZygpLnRoZW4oKCkgPT5cclxuICAgIHRoaXMuaHR0cENsaWVudFxyXG4gICAgICAucG9zdChcclxuICAgICAgICB0aGlzLmh0dHAgKyAnL2FwaS92MS9kZXZpY2VzdGF0dXMnLFxyXG4gICAgICAgIGRldmljZVN0YXR1cy5tYXAoYm9sID0+ICh7XHJcbiAgICAgICAgICBkZXZpY2U6IHRoaXMuZGV2aWNlLFxyXG4gICAgICAgICAgc2VjcmV0OiB0aGlzLmhhc2gsXHJcbiAgICAgICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgcHVtcDoge1xyXG4gICAgICAgICAgICBjbG9jazogYm9sLmRhdGVTdHJpbmcsXHJcbiAgICAgICAgICAgIHJlc2Vydm9pcjogYm9sLnJlc2Vydm9pcixcclxuICAgICAgICAgICAgc3RhdHVzOiB7IHN0YXR1czogYm9sLnN0YXR1cywgdGltZXN0YW1wOiAxNTU3MDYxNzU1IH0sXHJcbiAgICAgICAgICAgIGV4dGVuZGVkOiB7IHZlcnNpb246ICcxLjAnLCBBY3RpdmVQcm9maWxlOiAnbWVkbGluaycgfSxcclxuICAgICAgICAgICAgYmF0dGVyeTogeyB2b2x0YWdlOiBib2wudm9sdGFnZS50b1N0cmluZygpLnN1YnN0cmluZygwLCA0KSB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdXBsb2FkZXJCYXR0ZXJ5OiBib2wucGVyY2VudFxyXG4gICAgICAgIH0pKSkuc3Vic2NyaWJlKHJlc29sdmUsIHJlamVjdCkpO1xyXG4gIH0pO1xyXG59fVxyXG4iXX0=