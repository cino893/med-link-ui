import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DataFacadeService } from '~/app/shared/data-facade.service';
import { ForegroundUtilService } from '~/app/shared/foreground-facade.service';
import { RawDataService } from '~/app/shared/raw-data-parse.service';

@Component({
  selector: 'Browse',
  moduleId: module.id,
  templateUrl: './browse.component.html'
})
export class BrowseComponent implements OnInit {
  targetBluDeviceUUID = '';
  text = '';
  output = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private rawDataParse: RawDataService,
    private fa: DataFacadeService,
    private foregroundUtilService: ForegroundUtilService
  ) {
    // Use the component constructor to inject providers.
  }

  ngOnInit(): void {
    try {
      this.foregroundUtilService.startForeground();
      console.log("Foreground Start")
      setInterval(()=>console.log("interval"),10000)
      this.fa.establishConnectionWithPump()
    } catch (e) {
      console.error(e);
      this.foregroundUtilService.stopForeground();
    }
  }
}
