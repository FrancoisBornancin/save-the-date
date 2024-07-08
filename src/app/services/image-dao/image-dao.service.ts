import { Injectable } from '@angular/core';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { CustomImageData } from '../../model/image-data';
import { InMemoryRepositoryService } from '../in-memory-repository/in-memory-repository.service';
import { BigImageData } from '../../model/big-image-data';

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
    return this.checkInDb(prefix, false)
  }

  isImagePrintedToUser(prefix: string): boolean{
    return this.checkInDb(prefix, true)
  }

  private checkInDb(prefix: string, forUser: boolean){
    let imageUrlFromDb;
    let imageUrl;

    let imageTab;
    let imageTabFromDb;

    if(prefix == 'upper'){
      imageTab = this.imageManager.upperBigImageTab
      imageTabFromDb = this.imageManager.upperBigImageTabFromDb
    }else{
      imageTab = this.imageManager.belowBigImageTab
      imageTabFromDb = this.imageManager.belowBigImageTabFromDb
    }

    imageUrlFromDb = this.getUrlContent(
      imageTabFromDb, 
      forUser ? 0 : this.selectedIndex.index
    );
    imageUrl = this.getUrlContent(imageTab, this.selectedIndex.index); 

    return (imageUrl == imageUrlFromDb) ? true : false;
  }

  private getUrlContent(imageTab: BigImageData[], index: number): string{
    return imageTab
    .filter(image => image.key == index)
    .at(0)!
    .imageUrlContent!;
  }

  private save(prefix: string, toUser: boolean){
    let folder = '';
    let imageUrl = '';

    prefix == 'upper' ? (
      folder = this.inMemoryRepository.upperImageFolder,
      imageUrl = this.imageManager.upperImageUrl  
    ) : (
      folder = this.inMemoryRepository.belowImageFolder,
      imageUrl = this.imageManager.belowImageUrl
    )

    const imageData: CustomImageData = this.imageDataUtils.getImageData(imageUrl);
    this.imageDataUtils.saveImageData(
      toUser ? 0 : this.selectedIndex.index, 
      imageData, 
      folder
    );
  }

  saveImage(prefix: string){
    this.save(prefix, false)
  }

  saveImageToUser(prefix: string){
    this.save(prefix, true)
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
