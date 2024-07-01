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

  isImagePrintedToUser(): boolean{
    const userIndex: number = 0;

    const imageUrlFromDb = 
      this.imageManager.bigImageTabFromDb
        .filter(image => image.key == userIndex)
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
    const imageData: CustomImageData = this.imageDataUtils.getImageData(this.imageManager.imageUrl);
    this.imageDataUtils.saveImageData(this.selectedIndex.index, imageData, this.inMemoryRepository.imageFolder);
  }

  saveImageToUser(){
    const userIndex: number = 0;
    const imageData: CustomImageData = this.imageDataUtils.getImageData(this.imageManager.imageUrl);
    this.imageDataUtils.saveImageData(userIndex, imageData, this.inMemoryRepository.imageFolder);
  }

  getImageUrl(): string{
    return this.imageManager.bigImageTab
    .filter(element => element.key == this.selectedIndex.index)
    .map(element => element.imageUrlContent)
    .at(0)!
    ;
  }
}
