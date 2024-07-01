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

  initTasks(imageFolder: string, imagesIndexes: number[]){
    this.imageManager.bigImageTab =
    imagesIndexes
      .map(element => {
        return {key: element}
      })

    this.imageManager.bigImageTabFromDb =
    imagesIndexes
      .map(element => {
        return {key: element}
      })

    return this.imageManager.bigImageTab.map(element => this.imageManager.fillBigImageTab(element.key, imageFolder));
  }
}
