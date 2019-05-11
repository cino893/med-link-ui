import { Injectable } from "@angular/core";
import { from, Observable } from 'rxjs';
import { IBasicSettings } from "~/app/model/med-link.model";

const Sqlite = require("nativescript-sqlite");

@Injectable({
  providedIn: "root"
})
export class DatabaseService {
  database;

  createTable() {
    const adamDb = new Sqlite("test-adam.db");
    const createMyTable = adamDb.then(
      db => {
        db.execSQL(
        `CREATE TABLE IF NOT EXISTS entries (id INTEGER, glucose TEXT, dateString TEXT, isSend INTEGER DEFAULT 0);`,
        ).then(db2 => db.execSQL('CREATE TABLE IF NOT EXISTS treatments (id INTEGER, basalValue TEXT, dateString TEXT, isSend INTEGER DEFAULT 0);'))
            .then(db4 => db.execSQL('DROP TABLE tempbasal'))
            .then(db2 => db.execSQL('CREATE TABLE IF NOT EXISTS tempbasal (id INTEGER, percentsOfBasal TEXT, minutes INTEGER, dateString TEXT, isSend INTEGER DEFAULT 0);'))
         .then(db3 => db.execSQL('CREATE TABLE IF NOT EXISTS devicestatus (id INTEGER, reservoir NUMBER, voltage NUMBER, dateString TEXT, percent TEXT, status TEXT, isSend INTEGER DEFAULT 0);'))
            .then(
          id => {
            this.database = db;
          },
          error => {
            console.log('CREATE TABLE ERROR', error);
          }
        );
      },
      error => {
        console.log("OPEN DB ERROR", error);
      }
    );
  }

  public insertBG(bloodGlucose: { value: number; date: Date }) {
    return from(
      this.database.execSQL(
        "INSERT INTO entries (glucose, dateString) VALUES (?, ?)",
        [+bloodGlucose.value, bloodGlucose.date.toString()]
      )
    );
  }

  public updateBG() {
    return from(
        this.database.execSQL(
            "UPDATE entries SET isSend = 1 WHERE isSend = 0"
        )
    );
  }

  public insertTreatments(lastBolus: {value: number; date: Date }) {
    return from(
      this.database.execSQL(
        "INSERT INTO treatments (basalValue, dateString) VALUES (?, ?)",
        [+lastBolus.value, lastBolus.date.toString()]
      )
    );
  }

  public updateTreatments() {
    return from(
        this.database.execSQL(
            "UPDATE treatments SET isSend = 1 WHERE isSend = 0"
        )
    );
  }
  public insertDeviceStatus(insulinInPompLeft , batteryVoltage, data: {data: Date; percent: number}, status: string) {
    return from(
        this.database.execSQL(
            'INSERT INTO devicestatus (reservoir, voltage, dateString, percent, status) VALUES (?, ?, ?, ?, ?)',
            [insulinInPompLeft, batteryVoltage, data.data, data.percent, status]
        )
    );
  }
  public updateDS() {
    return from(
        this.database.execSQL(
            'UPDATE devicestatus SET isSend = 1 WHERE isSend = 0'
        )
    );
  }
  public insertTempBasal(percentsOfBasal , minutes, dateString) {
    return from(
        this.database.execSQL(
            'INSERT INTO tempbasal (percentsOfBasal, minutes, dateString) VALUES (?, ?, ?)',
            [percentsOfBasal, minutes, dateString]
        )
    );
  }
  public updateTempBasal() {
    return from(
        this.database.execSQL(
            "UPDATE tempbasal SET isSend = 1 WHERE isSend = 0"
        )
    );
  }
  public getBG(): Observable<Array<Array<string>>>  {
    return from(
      this.database.all(
        "SELECT glucose, dateString FROM entries WHERE isSend = 0"
      )
    );
  }
    public getTreatments(): Observable<Array<Array<string>>>  {
        return from(
            this.database.all(
                "SELECT basalValue, dateString FROM treatments WHERE isSend = 0 GROUP BY basalValue, dateString"
            )
        );
    }
  public getDS(): Observable<Array<Array<string>>>  {
    return from(
        this.database.all(
            "SELECT reservoir, voltage, dateString, percent, status FROM devicestatus WHERE isSend = 0"
        )
    );
  }
  public getTempBasal(): Observable<Array<Array<string>>>  {
    return from(
        this.database.all(
            'SELECT percentsOfBasal, minutes, dateString FROM tempbasal WHERE isSend = 0; ',
        ),
    );
  }
}
