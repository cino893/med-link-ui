import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IBasicSettings } from '~/app/model/med-link.model';
import { DatabaseService } from '~/app/shared/database.service';
import { NightscoutApiService } from '~/app/shared/nightscout-api.service';

@Injectable({
  providedIn: 'root'
})
export class DataFacadeService {

  constructor(private databaseService: DatabaseService, private nightscoutApiService: NightscoutApiService) { }



  sendDataToLocalDb(pumpStatus: IBasicSettings){
    this.databaseService
  }
}
