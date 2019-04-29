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
          `CREATE TABLE IF NOT EXISTS treatments (id INTEGER, basalValue TEXT, dateString TEXT, isSend INTEGER DEFAULT 0);
           CREATE TABLE IF NOT EXISTS entries (id INTEGER, glucose TEXT, dateString TEXT, isSend INTEGER DEFAULT 0);
           `
        ).then(
          id => {
            this.database = db;
          },
          error => {
            console.log("CREATE TABLE ERROR", error);
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

  public insertTreatments(lastBolus: {value: number; date: Date }) {
    return from(
      this.database.execSQL(
        "INSERT INTO treatments (basalValue, dateString) VALUES (?, ?)",
        [+lastBolus.value, lastBolus.date.toString()]
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
                "SELECT basalValue, dateString FROM treatments WHERE isSend = 0"
            )
        );
    }
}
