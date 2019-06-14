import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as Permissions from 'nativescript-permissions';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { ForegroundFacadeService } from '~/app/shared/foreground-facade.service';
import { PumpBluetoothApiService } from '~/app/shared/pump-bluetooth-api.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';

@Component({
  selector: 'Browse',
  moduleId: module.id,
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  text = '';
  output = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService,
    private foregroundUtilService: ForegroundFacadeService,
    private pumpBluetoothApiService: PumpBluetoothApiService
  ) {
  }

  setPermissions() {
    Permissions.requestPermission(
      android.Manifest.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
    )
      .then(() =>
        Permissions.requestPermission(
          android.Manifest.permission.ACCESS_COARSE_LOCATION
        )
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
      )     .then(() =>
        Permissions.requestPermission(
          android.Manifest.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS
        )
      )
      .then(() => Permissions.requestPermission(
        android.Manifest.permission.WRITE_SETTINGS
      ))
      .then(() => {
      this.pumpBluetoothApiService.enable();
      try {
        this.foregroundUtilService.startForeground();

        console.log('Foreground Start');
        setInterval(() => console.log('interval2' + new Date() + 'a'), 10000);
        this.fa.establishConnectionWithPump();
      } catch (e) {
        console.error(e);

        this.foregroundUtilService.stopForeground();
      }
    });
  }

  ngOnInit(): void {

  }
}
