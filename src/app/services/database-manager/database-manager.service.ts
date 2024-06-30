import { Injectable } from '@angular/core';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { LayoutData } from '../../model/layout-data/layout-data';
import { ImageDataUtilsService } from '../image-data-utils/image-data-utils.service';


@Injectable({
  providedIn: 'root'
})
export class DatabaseManagerService {
  constructor(
    private imageManager: ImageDataUtilsService
  ) { }

  isImageInDb(index: number): boolean{
    const imageUrlFromDb = 
      this.imageManager.bigImageTabFromDb
        .filter(image => image.key == index)
        .at(0)!
        .imageUrlContent;

    const imageUrl = 
      this.imageManager.bigImageTab
        .filter(image => image.key == index)
        .at(0)!
        .imageUrlContent;

    return (imageUrl == imageUrlFromDb) ? true : false;
  }
}
