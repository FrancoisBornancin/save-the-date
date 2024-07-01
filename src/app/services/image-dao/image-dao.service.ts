import { Injectable } from '@angular/core';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { CustomImageData } from '../../model/image-data';
import { CommonFacadeService } from '../common-facade/common-facade.service';

@Injectable({
  providedIn: 'root'
})
export class ImageDaoService {

  constructor(
    private imageManager: ImageManagerService,
    private selectedIndex: SelectedIndexService,
    private imageDataUtils: ImageManagerService,
    private commonFacade: CommonFacadeService,
  ) { }

  isImageInDb(): boolean{
    const imageUrlFromDb = 
      this.imageManager.bigImageTabFromDb
        .filter(image => image.key == this.selectedIndex.index)
        .at(0)!
        .imageUrlContent;

    const imageUrl = 
      this.imageManager.bigImageTab
        .filter(image => image.key == this.selectedIndex.index)
        .at(0)!
        .imageUrlContent;

    return (imageUrl == imageUrlFromDb) ? true : false;
  }

  saveImage(){
    const imageData: CustomImageData = this.imageDataUtils.getImageData(this.commonFacade.imageUrl);
    this.imageDataUtils.saveImageData(this.selectedIndex.index, imageData, this.commonFacade.imageFolder);
  }

  getImageUrl(): string{
    return this.imageManager.bigImageTab
    .filter(element => element.key == this.selectedIndex.index)
    .map(element => element.imageUrlContent)
    .at(0)!
    ;
  }
}
