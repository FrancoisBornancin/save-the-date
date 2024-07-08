import { Injectable } from '@angular/core';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { CustomImageData } from '../../model/image-data';
import { InMemoryRepositoryService } from '../in-memory-repository/in-memory-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ImageDaoService {

  constructor(
    private imageManager: ImageManagerService,
    private selectedIndex: SelectedIndexService,
    private imageDataUtils: ImageManagerService,
    private inMemoryRepository: InMemoryRepositoryService,
  ) { }

  isImageInDb(prefix: string): boolean{
    let imageUrlFromDb;
    let imageUrl;

    if(prefix == 'upper'){
      imageUrlFromDb = 
      this.imageManager.upperBigImageTabFromDb
        .filter(image => image.key == this.selectedIndex.index)
        .at(0)!
        .imageUrlContent;

      imageUrl = 
        this.imageManager.upperBigImageTab
          .filter(image => image.key == this.selectedIndex.index)
          .at(0)!
          .imageUrlContent;
    }else{
      imageUrlFromDb = 
      this.imageManager.belowBigImageTabFromDb
        .filter(image => image.key == this.selectedIndex.index)
        .at(0)!
        .imageUrlContent;

      imageUrl = 
        this.imageManager.belowBigImageTab
          .filter(image => image.key == this.selectedIndex.index)
          .at(0)!
          .imageUrlContent;
    }


    return (imageUrl == imageUrlFromDb) ? true : false;
  }

  isImagePrintedToUser(prefix: string): boolean{
    const userIndex: number = 0;
    let imageUrlFromDb;
    let imageUrl;

    if(prefix == 'upper'){
      imageUrlFromDb = 
      this.imageManager.upperBigImageTabFromDb
        .filter(image => image.key == userIndex)
        .at(0)!
        .imageUrlContent;

      imageUrl = 
      this.imageManager.upperBigImageTab
        .filter(image => image.key == this.selectedIndex.index)
        .at(0)!
        .imageUrlContent;
    }else{
      imageUrlFromDb = 
      this.imageManager.belowBigImageTabFromDb
        .filter(image => image.key == userIndex)
        .at(0)!
        .imageUrlContent;

      imageUrl = 
      this.imageManager.belowBigImageTab
        .filter(image => image.key == this.selectedIndex.index)
        .at(0)!
        .imageUrlContent;
    }

    return (imageUrl == imageUrlFromDb) ? true : false;
  }

  saveImage(prefix: string){
    let folder = '';
    let imageUrl = '';

    prefix == 'upper' ? 
    folder = this.inMemoryRepository.upperImageFolder 
    : folder = this.inMemoryRepository.belowImageFolder   

    prefix == 'upper' ? 
    imageUrl = this.imageManager.upperImageUrl 
    : imageUrl = this.imageManager.belowImageUrl  

    const imageData: CustomImageData = this.imageDataUtils.getImageData(imageUrl);
    this.imageDataUtils.saveImageData(this.selectedIndex.index, imageData, folder);
  }

  saveImageToUser(prefix: string){
    const userIndex: number = 0;

    let folder = '';
    let imageUrl = '';

    prefix == 'upper' ? 
    folder = this.inMemoryRepository.upperImageFolder 
    : folder = this.inMemoryRepository.belowImageFolder  
    
    prefix == 'upper' ? 
    imageUrl = this.imageManager.upperImageUrl 
    : imageUrl = this.imageManager.belowImageUrl  

    const imageData: CustomImageData = this.imageDataUtils.getImageData(imageUrl);
    this.imageDataUtils.saveImageData(userIndex, imageData, folder);
  }

  getImageUrl(prefix: string): string{
    if(prefix == 'upper'){
      return this.imageManager.upperBigImageTab
      .filter(element => element.key == this.selectedIndex.index)
      .map(element => element.imageUrlContent)
      .at(0)!
      ;
    }else{
      return this.imageManager.belowBigImageTab
      .filter(element => element.key == this.selectedIndex.index)
      .map(element => element.imageUrlContent)
      .at(0)!
      ;
    }

  }
}
