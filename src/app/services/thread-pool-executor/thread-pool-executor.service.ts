import { Injectable } from '@angular/core';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadPoolExecutorService {

  constructor(
    public imageManager: ImageManagerService,
    public layoutManager: LayoutManagerService
  ) { }

  initTasks(imageFolder: string){
    this.imageManager.bigImageTab =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    this.imageManager.bigImageTabFromDb =
    this.layoutManager.layoutDataTabFromDb
      .map(element => {
        return {key: element.key}
      })

    return this.imageManager.bigImageTab.map(element => this.imageManager.fillBigImageTab(element.key, imageFolder));
  }
}
