import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Permissions from 'nativescript-permissions';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { ForegroundFacadeService } from '~/app/shared/foreground-facade.service';
import { PumpBluetoothApiService } from '~/app/shared/pump-bluetooth-api.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';
import { DatabaseService } from '~/app/shared/database.service';

@Component({
  selector: 'Browse',
  moduleId: module.id,
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  text = '';
  output = '';
  uuid: string;
  items = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService,
    private databaseService: DatabaseService,
    private foregroundUtilService: ForegroundFacadeService,
    private pumpBluetoothApiService: PumpBluetoothApiService
  ) {
  }
  saveUuid(arg) {
    console.log("WWWWWWWW" + arg.text);
    this.uuid = arg.text.toString().split(',')[1];
    console.log("CCCWWWWW" + this.uuid);
    this.databaseService.insertMAC(this.uuid);
    //this.databaseService.getMAC().then(a => console.log("TAAAAK:" + a));
  }
  scan() {
    console.log("a");
    Permissions.requestPermission(
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    ).then(() =>
    this.pumpBluetoothApiService.scanAndConnect2().subscribe(a => {
      console.log("TTRRR" + this.pumpBluetoothApiService.targetBluDeviceUUID + a);
      this.items = this.pumpBluetoothApiService.targetBluDeviceUUID2;
      this.uuid = this.pumpBluetoothApiService.targetBluDeviceUUID;
      }));
  }
  setPermissions() {
    Permissions.requestPermission(
      android.Manifest.permission.ACCESS_COARSE_LOCATION
    )
      .then(() =>
        Permissions.requestPermission(android.Manifest.permission.BLUETOOTH)
      )
      .then(() =>
        Permissions.requestPermission(
          android.Manifest.permission.BLUETOOTH_ADMIN
        )
      )
      .then(() =>
        Permissions.requestPermission(
          android.Manifest.permission.WAKE_LOCK
        )
      )
      .then(() => Permissions.requestPermission(
        android.Manifest.permission.WRITE_SETTINGS
      ))
      .then(() => {
      this.pumpBluetoothApiService.enable();
      try {
          this.foregroundUtilService.startForeground();
          setInterval(() => console.log('interval22         ' + new Date() + 'a'), 10000);
          setTimeout(() => this.fa.establishConnectionWithPump(), 1000)
      } catch (e) {
        console.error(e);

        this.foregroundUtilService.stopForeground();
      }
    });
  }

  ngOnInit(): void {

  }
}
