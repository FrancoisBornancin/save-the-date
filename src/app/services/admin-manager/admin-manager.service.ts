import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminManagerService {
  isPreviewActive!: boolean;
  isAdminModeActive: boolean = false;


  eventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  activatePreview(){
    // this.isPreviewActive = true;
    this.eventEmitter.emit(true)
    console.log("");
  }

  disactivatePreview(){
    // this.isPreviewActive = false;
    this.eventEmitter.emit(false)
    console.log("");
  }


}
