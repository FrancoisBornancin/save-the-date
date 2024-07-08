import { Injectable } from '@angular/core';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { InMemoryRepositoryService } from '../in-memory-repository/in-memory-repository.service';

@Injectable({
  providedIn: 'root'
})
export class ThreadPoolExecutorService {

  constructor(
    public imageManager: ImageManagerService,
    public layoutManager: LayoutManagerService,
    public inMemoryRepository: InMemoryRepositoryService
  ) { }

  initTasks(imagesIndexes: number[], prefix: string){
    return this.getBigImageTabData(imagesIndexes, prefix);
  }

  private getBigImageTabData(imageIndexes: number[], prefix: string){
    this.initBigImageTabKeys(true, prefix, imageIndexes);
    this.initBigImageTabKeys(false, prefix, imageIndexes);
    if(prefix == 'upper') return this.imageManager.upperBigImageTab.map(element => this.imageManager.fillBigImageTab(element.key, prefix));  
    else return this.imageManager.belowBigImageTab.map(element => this.imageManager.fillBigImageTab(element.key, prefix));
  }

  private initBigImageTabKeys(fromDb: boolean, prefix: string, imageIndexes: number[]){
    if(prefix == 'upper'){
      if(fromDb){
        this.imageManager.upperBigImageTabFromDb =
        imageIndexes
          .map(element => {
            return {key: element}
          })
      }else{
        this.imageManager.upperBigImageTab =
        imageIndexes
          .map(element => {
            return {key: element}
          })
      }
    }else{
      if(fromDb){
        this.imageManager.belowBigImageTabFromDb =
        imageIndexes
          .map(element => {
            return {key: element}
          })
      }else{
        this.imageManager.belowBigImageTab =
        imageIndexes
          .map(element => {
            return {key: element}
          })
      }
    }
  }
}
