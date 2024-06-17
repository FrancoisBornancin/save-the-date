import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminManagerService {
  isPreviewActive: boolean = false;
  isAdminModeActive: boolean = false;

  activatePreview(){
    this.isPreviewActive = true;
  }

  disactivatePreview(){
    this.isPreviewActive = false;
  }


}
