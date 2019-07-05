import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { IBasicSettings } from '~/app/model/med-link.model';

const Sqlite = require('nativescript-sqlite');

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  database;
  createTable() {
    const adamDb = new Sqlite('test-adam.db');
    const createMyTable = adamDb.then(
      db => {
        db.execSQL(
          `CREATE TABLE IF NOT EXISTS entries (id INTEGER, glucose TEXT, dateString TEXT, isSend INTEGER DEFAULT 0);`
        ).then(db2 => db.execSQL('CREATE TABLE IF NOT EXISTS treatments (id INTEGER, basalValue TEXT, dateString TEXT, isSend INTEGER DEFAULT 0);'))
          .then(db3 => db.execSQL('CREATE TABLE IF NOT EXISTS tempbasal (id INTEGER, percentsOfBasal TEXT, minutes INTEGER, dateString TEXT, isSend INTEGER DEFAULT 0);'))
          .then(db4 => db.execSQL('CREATE TABLE IF NOT EXISTS devicestatus (id INTEGER, reservoir NUMBER, voltage NUMBER, dateString TEXT, percent TEXT, status TEXT, isSend INTEGER DEFAULT 0);'))
          .then(db2 => db.execSQL('CREATE TABLE IF NOT EXISTS conf (id INTEGER DEFAULT 2, nsUrl TEXT, nsKey TEXT, dateString TEXT DEFAULT SYSDATE);'))
          .then(
            id => {
              this.database = db;
            },
            error => {
              console.log('CREATE TABLE ERRORs', error);
            }
          );
      },
      error => {
        console.log('OPEN DB ERROR', error);
      }
    );
  }

  public insertBG(bloodGlucose: { value: number; date: Date }) {
    return this.database.execSQL(
      'INSERT INTO entries (glucose, dateString) VALUES (?, ?)',
      [+bloodGlucose.value, bloodGlucose.date.toString()]
    );
  }

  public updateBG() {
    return this.database.execSQL(
        'UPDATE entries SET isSend = 1 WHERE isSend = 0'
    );
  }

  public insertTreatments(lastBolus: { value: number; date: Date }) {
    return this.database.execSQL(
      'INSERT INTO treatments (basalValue, dateString) VALUES (?, ?)',
      [+lastBolus.value, lastBolus.date.toString()]
    );
  }

  public updateTreatments() {
    return this.database.execSQL(
        'UPDATE treatments SET isSend = 1 WHERE isSend = 0'
    );
  }

  public insertDeviceStatus(insulinInPompLeft, batteryVoltage, data: { data: Date; percent: number }, status: string) {
    return this.database.execSQL(
        'INSERT INTO devicestatus (reservoir, voltage, dateString, percent, status) VALUES (?, ?, ?, ?, ?)',
        [insulinInPompLeft, batteryVoltage, data.data, data.percent, status]
    );
  }

  public updateDS() {
    return this.database.execSQL(
        'UPDATE devicestatus SET isSend = 1 WHERE isSend = 0'
    );
  }
  public insertTempBasal(percentsOfBasal, minutes, dateString) {
    return this.database.execSQL(
        'INSERT INTO tempbasal (percentsOfBasal, minutes, dateString) VALUES (?, ?, ?)',
        [percentsOfBasal, minutes, dateString]
    );
  }

  public updateTempBasal() {
    return this.database.execSQL(
        'UPDATE tempbasal SET isSend = 1 WHERE isSend = 0'
    );
  }

  public getBG(): Observable<Array<Array<string>>> {
    return from(
      this.database.all(
        'select * from (SELECT glucose, dateString, isSend, glucose - (select e2.glucose from entries e2 where e2.rowid = e1.rowid-1 and e2.dateString < e1.dateString  ORDER BY e2.dateString LIMIT 1 ) as a from entries e1) where isSend = 0'
      )
    );
  }

  public getTreatments(): Observable<Array<Array<string>>> {
    return from(
      this.database.all(
        'SELECT basalValue, dateString FROM treatments WHERE isSend = 0 GROUP BY basalValue, dateString'
      )
    );
  }

  public getDS(): Observable<Array<Array<string>>> {
    return from(
      this.database.all(
        'SELECT reservoir, voltage, dateString, percent, status FROM devicestatus WHERE isSend = 0'
      )
    );
  }
  public NSconf(): Observable<Array<Array<string>>> {
    return from(
      this.database.all(
        'SELECT nsUrl, nsKey FROM conf WHERE nsUrl is not null and nsKey is not null order by dateString desc limit 1'
      )
    );
  }
  public insertNS(nsUrl, nsKey) {
    return this.database.execSQL(
      'INSERT INTO conf (nsUrl, nsKey) VALUES (?, ?)',
      [nsUrl, nsKey]
    );
  }
  public updateNS(nsUrl, nsKey) {
    return this.database.execSQL(
      'UPDATE conf SET ns_url = ?, ns_key = ? WHERE id = 1',
      [nsUrl, nsKey]
    );
  }

  public getTempBasal(): Observable<Array<Array<string>>> {
    return from(
      this.database.all(
        'SELECT percentsOfBasal, minutes, dateString FROM tempbasal WHERE isSend = 0; '
      )
    );
  }
}
