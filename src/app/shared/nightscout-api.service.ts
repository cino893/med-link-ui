import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { nightScoutPath } from "~/app/env";

@Injectable({
  providedIn: "root"
})
export class NightscoutApiService {
  constructor(private httpClient: HttpClient) {}

  sendNewBG(glucose, data) {
    this.httpClient
      .post(nightScoutPath + "entries.json", {
        device: "FakeTaxi2",
        date: data,
        sgv: glucose,
        secret: "258628a55f1370569738e7da6d135c61dcaea7c9"
      })
      .subscribe();
  }

  sendNewTreatment() {
    this.httpClient
      .post(nightScoutPath + "treatments.json", {
        enteredBy: "FakeTaxi",
        reason: "low treatment",
        carbs: 0,
        secret: "258628a55f1370569738e7da6d135c61dcaea7c9"
      })
      .subscribe();
  }
}
