import { Injectable } from '@angular/core';
import { Peripheral } from 'nativescript-bluetooth';
import { Observable } from 'rxjs';
import { toArray } from 'rxjs/internal/operators';
import { reduce } from 'rxjs/internal/operators/reduce';
import bluetooth = require('nativescript-bluetooth');

@Injectable({
  providedIn: 'root'
})
export class PumpBluetoothApiService {
  targetBluDeviceUUID;

  scanAndConnect() {
    return new Promise((resolve, reject) => {
      this.targetBluDeviceUUID = '';
      bluetooth.enable();
      bluetooth
        .startScanning({
          onDiscovered: (peripheral: Peripheral) => {
            console.log(peripheral.name);
            if (peripheral.name && peripheral.name.toLowerCase() === 'hmsoft') {
              this.targetBluDeviceUUID = peripheral.UUID;
            }
          },
          skipPermissionCheck: false,
          seconds: 3
        })
        .then(
          () => {
            if (!this.targetBluDeviceUUID) {
              return;
            }
            bluetooth.connect({
              UUID: this.targetBluDeviceUUID,
              onConnected: (peripheral: Peripheral) => {
                alert('Połączono');
                resolve();
              },
              onDisconnected: (peripheral: Peripheral) => alert('Rozłączono')
            });
          },
          () => {
            reject();
          }
        );
    });
  }

  sendCommand(command) {
    const buffer = [];
    for (const char of command) {
      const charCode = char.charCodeAt(0);
      buffer.push(charCode);
      if (charCode === 0x0a /*LF*/) {
        buffer.push(0x0d /*CR*/);
      }
    }
    if (buffer.length) {
      this.recursiveWrite(buffer);
    }
  }

  private recursiveWrite(
    array: Array<number>,
    startByte = 0,
    chunkLength = 20
  ) {
    const nextByte = startByte + chunkLength;
    bluetooth
      .writeWithoutResponse({
        peripheralUUID: this.targetBluDeviceUUID,
        characteristicUUID: 'ffe1',
        serviceUUID: 'ffe0',
        value: new Uint8Array(array.slice(startByte, nextByte))
      })
      .then(() => {
        if (nextByte < array.length) {
          this.recursiveWrite(array, nextByte);
        }
      });
  }

  read() {
    return new Observable<string>(observer => {
      bluetooth.startNotifying({
        onNotify: ({ value }) => {
          const result = new Uint8Array(value).reduce(
            (o, byte) => (o += String.fromCharCode(byte)),
            ''
          );

          observer.next(result);
          if (result.includes('EomEomEom')) {
            observer.complete();
          }
        },
        peripheralUUID: this.targetBluDeviceUUID,
        characteristicUUID: 'ffe1',
        serviceUUID: 'ffe0'
      });
    }).pipe(reduce((acc, val) => acc + val));
  }
}
