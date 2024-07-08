import { Injectable } from '@angular/core';
import { ImageManagerService } from '../image-manager/image-manager.service';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { InMemoryRepositoryService } from '../in-memory-repository/in-memory-repository.service';
import { BigImageData } from '../../model/big-image-data';

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
    let imageTab;
    this.initBigImageTabKeys(true, prefix, imageIndexes);
    this.initBigImageTabKeys(false, prefix, imageIndexes);

    if(prefix == 'upper') imageTab = this.imageManager.upperBigImageTab
    else imageTab = this.imageManager.belowBigImageTab  

    return imageTab.map(element => this.imageManager.fillBigImageTab(element.key, prefix));
  }

  private initBigImageTabKeys(fromDb: boolean, prefix: string, imageIndexes: number[]){
    if(prefix == 'upper' && fromDb) this.imageManager.upperBigImageTabFromDb = this.initKeys(imageIndexes)
    if(prefix == 'upper' && !fromDb) this.imageManager.upperBigImageTab = this.initKeys(imageIndexes)
    if(prefix == 'below' && fromDb) this.imageManager.belowBigImageTabFromDb = this.initKeys(imageIndexes)
    if(prefix == 'below' && !fromDb) this.imageManager.belowBigImageTab = this.initKeys(imageIndexes)
  }

  private initKeys(imageIndexes: number[]){
    return imageIndexes
      .map(element => {
        return {key: element}
      })
  }
}
