import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { nightScoutPath } from "~/app/env";
import { DatabaseService } from "~/app/shared/database.service";

@Injectable({
  providedIn: "root"
})
export class NightscoutApiService {
  secret = "d6026bb45e7efd38de82680c75d31cf7f7a6a1e3";
  //secret = '258628a55f1370569738e7da6d135c61dcaea7c9'
  device = "FakeTaxi2";

  constructor(private httpClient: HttpClient) {}

  sendNewBG(glucoses: Array<{ value: number; date: Date }>) {
      console.log('to chce wyslaa');
      this.httpClient
      .post(
        nightScoutPath + 'entries',
        glucoses.map(glucose => ({
          device: this.device,
          secret: this.secret,
          sgv: glucose.value,
          date: +glucose.date,
        }))).subscribe();
  }
}
