import { Injectable } from '@angular/core';
import { ImageDataUtilsService } from '../image-data-utils/image-data-utils.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { CustomImageData } from '../../model/image-data';
import { CommonFacadeService } from '../common-facade/common-facade.service';

@Injectable({
  providedIn: 'root'
})
export class ImageDaoService {

  constructor(
    private imageManager: ImageDataUtilsService,
    private selectedIndex: SelectedIndexService,
    private imageDataUtils: ImageDataUtilsService,
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
}
