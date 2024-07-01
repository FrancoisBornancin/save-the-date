import { Injectable } from '@angular/core';
import { LayoutData } from '../../model/layout-data/layout-data';
import { LayoutManagerService } from '../layout-manager/layout-manager.service';
import { AdminFacadeService } from '../admin-facade/admin-facade.service';
import { Observable } from 'rxjs';
import { CommonFacadeService } from '../common-facade/common-facade.service';
import { SelectedIndexService } from '../selected-index/selected-index.service';
import { ImageDaoService } from '../image-dao/image-dao.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutDaoService {
  layoutDataFromDb!: LayoutData
  layoutData!: LayoutData

  constructor(
    private layoutManager: LayoutManagerService,
    private adminFacade: AdminFacadeService,
    private commonFacade: CommonFacadeService,
    private selectedIndex: SelectedIndexService,
    private imageDao: ImageDaoService
  ) { }

  loadLayoutDataDropdown(index: number){
    this.layoutManager.setLayoutData();
    this.selectedIndex.index = index
    this.layoutManager.updateCurrentLayoutDataTab()
    this.layoutManager.setLayoutElements(index);
    this.commonFacade.imageUrl = this.imageDao.getImageUrl();
  }

  saveLayout(){
    this.layoutManager.setLayoutData()
    this.layoutManager.saveData();
  }

  loadData(): Observable<any>{
    return this.layoutManager.loadData(this.commonFacade.layoutJsonName);
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
}
