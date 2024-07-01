import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminManagerService {
  isPreviewActive!: boolean;
  isAdminModeActive: boolean = true;

  eventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  activatePreview(){
    this.eventEmitter.emit(true)
  }

  disactivatePreview(){
    this.eventEmitter.emit(false)
  }

  activateAdminMode(){
    this.isAdminModeActive = true;
  }

  disactivateAdminMode(){
    this.isAdminModeActive = false;
  }


}
