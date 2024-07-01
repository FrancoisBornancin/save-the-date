import { Injectable } from '@angular/core';
import { LayoutData } from '../../model/layout-data/layout-data';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { Observable } from 'rxjs';
import { InMemoryRepositoryService } from '../in-memory-repository/in-memory-repository.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { ImageDaoService } from '../image-dao/image-dao.service';
import { ImageManagerService } from '../image-manager/image-manager.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutDaoService {
  layoutDataFromDb!: LayoutData
  layoutData!: LayoutData

  constructor(
    private layoutManager: LayoutManagerService,
    private inMemoryRepository: InMemoryRepositoryService,
    private selectedIndex: SelectedIndexService,
    private imageDao: ImageDaoService,
    private imageManager: ImageManagerService
  ) { }

  loadLayoutDataDropdown(index: number){
    this.layoutManager.setLayoutData();
    this.selectedIndex.index = index
    this.layoutManager.updateCurrentLayoutDataTab()
    this.layoutManager.setLayoutElements(index);
    this.imageManager.imageUrl = this.imageDao.getImageUrl();
  }

  saveLayout(){
    this.layoutManager.setLayoutData()
    this.layoutManager.saveData();
  }

  loadData(): Observable<any>{
    return this.layoutManager.loadData(this.inMemoryRepository.layoutJsonName);
  }

  isLayoutInDb(): boolean{
    this.layoutDataFromDb
      = this.layoutManager.layoutDataTabFromDb
          .filter(element => element.key == this.layoutManager.layoutData.key)
          .at(0)!;

    this.layoutData = this.layoutManager.layoutData;

    for (const [layoutDataFromDbKey, layoutDataFromDbValue] of Object.entries(this.layoutDataFromDb)) {
      for (const [layoutDataKey, layoutDataValue] of Object.entries(this.layoutData)) {
          if (layoutDataFromDbKey == layoutDataKey) {
              for(const [layoutDataFromDbValueKey, layoutDataFromDbValueValue] of Object.entries(layoutDataFromDbValue)){
                for(const [layoutDataValueKey, layoutDataValueValue] of Object.entries(layoutDataValue)){
                  if(layoutDataValueKey == layoutDataFromDbValueKey){
                    const layoutDataFinalValue = layoutDataValueValue;
                    const layoutDataFromDBFinalValue = layoutDataFromDbValueValue;
                    if(layoutDataFinalValue != layoutDataFromDBFinalValue) return false;
                  }
                }
              }
          }
      }
  }

    return true;
  }

  isLayoutPrintedToUser(): boolean{
    const userIndex: number = 0;

    this.layoutDataFromDb
      = this.layoutManager.layoutDataTabFromDb
          .filter(element => element.key == userIndex)
          .at(0)!;

    this.layoutData = this.layoutManager.layoutData;

    for (const [layoutDataFromDbKey, layoutDataFromDbValue] of Object.entries(this.layoutDataFromDb)) {
      for (const [layoutDataKey, layoutDataValue] of Object.entries(this.layoutData)) {
          if (layoutDataFromDbKey == layoutDataKey) {
              for(const [layoutDataFromDbValueKey, layoutDataFromDbValueValue] of Object.entries(layoutDataFromDbValue)){
                for(const [layoutDataValueKey, layoutDataValueValue] of Object.entries(layoutDataValue)){
                  if(layoutDataValueKey == layoutDataFromDbValueKey){
                    const layoutDataFinalValue = layoutDataValueValue;
                    const layoutDataFromDBFinalValue = layoutDataFromDbValueValue;
                    if(layoutDataFinalValue != layoutDataFromDBFinalValue) return false;
                  }
                }
              }
          }
      }
  }

    return true;
  }
}
